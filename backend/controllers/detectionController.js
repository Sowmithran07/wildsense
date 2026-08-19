import AnimalDetection from '../models/AnimalDetection.js';
import Sensor from '../models/Sensor.js';
import Alert from '../models/Alert.js';
import Incident from '../models/Incident.js';
import { predictAnimalFromFrame } from '../services/animalRecognitionService.js';
import { calculateThreatLevel } from '../services/threatCalculator.js';
import { broadcastIntrusionAlert } from '../services/notificationService.js';
import { emitIntrusionAlert } from '../services/socketService.js';

// @desc    Get animal detections with filters and pagination
// @route   GET /api/detections
// @access  Public / Private
export const getDetections = async (req, res, next) => {
  try {
    const { animal, threatLevel, limit = 50, page = 1, startDate, endDate } = req.query;
    const query = {};

    if (animal && animal !== 'all') query.animal = animal;
    if (threatLevel && threatLevel !== 'all') query.threatLevel = threatLevel;
    if (startDate || endDate) {
      query.detectedAt = {};
      if (startDate) query.detectedAt.$gte = new Date(startDate);
      if (endDate) query.detectedAt.$lte = new Date(endDate);
    }

    const total = await AnimalDetection.countDocuments(query);
    const detections = await AnimalDetection.find(query)
      .sort({ detectedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('sensor', 'name sensorId type locationName');

    res.json({
      success: true,
      count: detections.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      detections,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single detection
// @route   GET /api/detections/:id
// @access  Public / Private
export const getDetectionById = async (req, res, next) => {
  try {
    const detection = await AnimalDetection.findById(req.params.id).populate('sensor');

    if (!detection) {
      return res.status(404).json({ success: false, message: 'Animal detection record not found.' });
    }

    res.json({ success: true, detection });
  } catch (error) {
    next(error);
  }
};

// @desc    Create manual or AI image detection
// @route   POST /api/detections
// @access  Private / IoT Device
export const createDetection = async (req, res, next) => {
  try {
    const {
      sensorId,
      image,
      animal: manualAnimal,
      latitude,
      longitude,
      confidence: manualConfidence,
      soundLevel,
      distanceToVillageKm,
    } = req.body;

    let sensor = null;
    if (sensorId) {
      sensor = await Sensor.findOne({ sensorId });
    }
    if (!sensor) {
      sensor = await Sensor.findOne({ status: 'active' });
    }

    let detectedAnimal = manualAnimal;
    let confidence = manualConfidence || 92.5;
    let finalImage = image;

    if (!detectedAnimal || !finalImage) {
      const aiResult = await predictAnimalFromFrame({
        imageData: image,
        sensorType: sensor?.type || 'Thermal Camera',
        soundLevel: soundLevel || 65,
      });
      detectedAnimal = detectedAnimal || aiResult.animal;
      confidence = manualConfidence || aiResult.confidence;
      finalImage = finalImage || aiResult.image;
    }

    const finalLat = latitude || (sensor ? sensor.latitude : 11.6664);
    const finalLng = longitude || (sensor ? sensor.longitude : 76.6295);
    const finalDistance = distanceToVillageKm || +(0.6 + Math.random() * 2.5).toFixed(2);

    const calculatedThreat = calculateThreatLevel({
      animal: detectedAnimal,
      distanceToVillageKm: finalDistance,
      confidence,
    });

    const count = await AnimalDetection.countDocuments();
    const detectionId = `DET-${new Date().getFullYear()}-${String(count + 101).padStart(4, '0')}`;

    const detection = await AnimalDetection.create({
      detectionId,
      animal: detectedAnimal,
      confidence,
      image: finalImage,
      sensor: sensor?._id,
      sensorId: sensor ? sensor.sensorId : 'SEN-CAM-101',
      locationName: sensor ? sensor.locationName : 'Zone Alpha Buffer',
      latitude: finalLat,
      longitude: finalLng,
      threatLevel: calculatedThreat,
      distanceToVillageKm: finalDistance,
      detectedAt: new Date(),
    });

    // Generate Alert
    const alertCount = await Alert.countDocuments();
    const alertId = `ALT-${new Date().getFullYear()}-${String(alertCount + 101).padStart(4, '0')}`;

    const alert = await Alert.create({
      alertId,
      detection: detection._id,
      animal: detectedAnimal,
      threatLevel: calculatedThreat,
      location: sensor ? sensor.locationName : 'Zone Alpha Buffer',
      latitude: finalLat,
      longitude: finalLng,
      distanceToVillageKm: finalDistance,
      status: 'new',
      broadcastRadiusKm: calculatedThreat === 'CRITICAL' ? 5.0 : 3.0,
      buzzerTriggered: calculatedThreat === 'HIGH' || calculatedThreat === 'CRITICAL',
    });

    // Generate Incident
    const incidentCount = await Incident.countDocuments();
    const incidentId = `INC-${new Date().getFullYear()}-${String(incidentCount + 101).padStart(4, '0')}`;

    const incident = await Incident.create({
      incidentId,
      detection: detection._id,
      alert: alert._id,
      animal: detectedAnimal,
      threatLevel: calculatedThreat,
      location: sensor ? sensor.locationName : 'Zone Alpha Buffer',
      latitude: finalLat,
      longitude: finalLng,
      status: 'open',
      actionTimeline: [
        {
          title: 'Manual/AI Detection Ingested',
          description: `AI Confidence: ${confidence}%. Threat: ${calculatedThreat}.`,
          user: req.user ? req.user.name : 'AI Vision Ingestion',
          timestamp: new Date(),
        },
      ],
    });

    await broadcastIntrusionAlert({ alert, detection });

    const liveAlertPayload = {
      ...alert.toObject(),
      detection: detection.toObject(),
      incidentId: incident.incidentId,
    };

    emitIntrusionAlert(liveAlertPayload);

    res.status(201).json({
      success: true,
      detection,
      alert: liveAlertPayload,
      incident,
    });
  } catch (error) {
    next(error);
  }
};
