import Sensor from '../models/Sensor.js';
import AnimalDetection from '../models/AnimalDetection.js';
import Alert from '../models/Alert.js';
import Incident from '../models/Incident.js';
import { predictAnimalFromFrame } from './animalRecognitionService.js';
import { calculateThreatLevel } from './threatCalculator.js';
import { broadcastIntrusionAlert } from './notificationService.js';
import { emitIntrusionAlert, emitSensorUpdate } from './socketService.js';

export const processIoTSensorTelemetry = async (payload) => {
  const {
    sensorId,
    motionDetected = false,
    soundLevel = 45,
    temperature = 26.5,
    batteryLevel = 90,
    signalStrength = 85,
    latitude,
    longitude,
    imageData = null,
    timestamp = new Date(),
  } = payload;

  // 1. Locate sensor or update telemetry
  let sensor = await Sensor.findOne({ sensorId });
  if (!sensor) {
    sensor = await Sensor.create({
      sensorId,
      name: `IoT Node ${sensorId}`,
      type: imageData ? 'Thermal Camera' : 'PIR Motion Sensor',
      locationName: 'Forest Boundary Buffer Node',
      latitude: latitude || 11.6664,
      longitude: longitude || 76.6295,
      batteryLevel,
      signalStrength,
      temperature,
      status: 'active',
      connectivity: 'online',
      lastActive: new Date(),
    });
  } else {
    sensor.batteryLevel = batteryLevel !== undefined ? batteryLevel : sensor.batteryLevel;
    sensor.signalStrength = signalStrength !== undefined ? signalStrength : sensor.signalStrength;
    sensor.temperature = temperature !== undefined ? temperature : sensor.temperature;
    sensor.lastActive = new Date();
    sensor.connectivity = 'online';
    if (sensor.batteryLevel < 20) {
      sensor.status = 'warning';
    }
    await sensor.save();
  }

  emitSensorUpdate(sensor);

  // 2. Anomaly evaluation: Is there motion or significant acoustic spike?
  const isIntrusionTriggered = motionDetected || soundLevel > 70 || Boolean(imageData);

  if (!isIntrusionTriggered) {
    return {
      success: true,
      intrusionDetected: false,
      sensorStatus: sensor.status,
      actuateHardware: { ledStrobe: false, ultrasonicBuzzer: false },
      message: 'Telemetry logged successfully. No intrusion detected.',
    };
  }

  // 3. AI Animal Classification
  const aiResult = await predictAnimalFromFrame({
    imageData,
    sensorType: sensor.type,
    soundLevel,
    thermalDiff: Math.abs(temperature - 22.0),
  });

  const detectionCoords = {
    latitude: latitude || sensor.latitude + (Math.random() - 0.5) * 0.005,
    longitude: longitude || sensor.longitude + (Math.random() - 0.5) * 0.005,
  };

  const distanceToVillage = +(0.4 + Math.random() * 2.8).toFixed(2);
  const calculatedThreat = calculateThreatLevel({
    animal: aiResult.animal,
    distanceToVillageKm: distanceToVillage,
    confidence: aiResult.confidence,
    movementSpeedKmH: 7.5,
  });

  // 4. Save Animal Detection record
  const detectionCount = await AnimalDetection.countDocuments();
  const detectionId = `DET-${new Date().getFullYear()}-${String(detectionCount + 101).padStart(4, '0')}`;

  const detection = await AnimalDetection.create({
    detectionId,
    animal: aiResult.animal,
    confidence: aiResult.confidence,
    image: aiResult.image,
    sensor: sensor._id,
    sensorId: sensor.sensorId,
    locationName: sensor.locationName,
    latitude: detectionCoords.latitude,
    longitude: detectionCoords.longitude,
    threatLevel: calculatedThreat,
    aiModelVersion: aiResult.modelVersion,
    movementSpeedKmH: +(4 + Math.random() * 12).toFixed(1),
    distanceToVillageKm: distanceToVillage,
    rawSensorData: {
      motionDetected: true,
      soundDecibels: soundLevel,
      thermalDiffCelsius: Math.abs(temperature - 22.0),
      vibrationFreqHz: 12.5,
    },
    detectedAt: new Date(timestamp),
  });

  // 5. Create Emergency Alert
  const alertCount = await Alert.countDocuments();
  const alertId = `ALT-${new Date().getFullYear()}-${String(alertCount + 101).padStart(4, '0')}`;

  const alert = await Alert.create({
    alertId,
    detection: detection._id,
    animal: aiResult.animal,
    threatLevel: calculatedThreat,
    location: sensor.locationName,
    latitude: detectionCoords.latitude,
    longitude: detectionCoords.longitude,
    distanceToVillageKm: distanceToVillage,
    status: 'new',
    broadcastRadiusKm: calculatedThreat === 'CRITICAL' ? 5.0 : calculatedThreat === 'HIGH' ? 3.5 : 2.0,
    buzzerTriggered: calculatedThreat === 'HIGH' || calculatedThreat === 'CRITICAL',
  });

  // 6. Create Incident Record
  const incidentCount = await Incident.countDocuments();
  const incidentId = `INC-${new Date().getFullYear()}-${String(incidentCount + 101).padStart(4, '0')}`;

  const incident = await Incident.create({
    incidentId,
    detection: detection._id,
    alert: alert._id,
    animal: aiResult.animal,
    threatLevel: calculatedThreat,
    location: sensor.locationName,
    latitude: detectionCoords.latitude,
    longitude: detectionCoords.longitude,
    status: 'open',
    actionTimeline: [
      {
        title: 'Intrusion Detected by Sensor',
        description: `Triggered by ${sensor.name} (${sensor.sensorId}). AI confidence ${aiResult.confidence}%.`,
        user: 'IoT Ingestion Gateway',
        timestamp: new Date(),
      },
      {
        title: `Threat Evaluated as ${calculatedThreat}`,
        description: `Distance from habitat: ${distanceToVillage} km. Auto-dispatched alerts.`,
        user: 'Threat Assessment Engine',
        timestamp: new Date(),
      },
    ],
  });

  // 7. Dispatch notifications and WebSockets
  await broadcastIntrusionAlert({ alert, detection });

  const liveAlertPayload = {
    ...alert.toObject(),
    detection: detection.toObject(),
    incidentId: incident.incidentId,
  };

  emitIntrusionAlert(liveAlertPayload);

  return {
    success: true,
    intrusionDetected: true,
    detection,
    alert: liveAlertPayload,
    incident,
    actuateHardware: {
      ledStrobe: calculatedThreat === 'CRITICAL' || calculatedThreat === 'HIGH',
      ultrasonicBuzzer: calculatedThreat === 'CRITICAL',
      pwmFrequencyHz: calculatedThreat === 'CRITICAL' ? 24000 : 0,
    },
    message: `Intrusion of ${aiResult.animal} successfully logged and dispatched.`,
  };
};
