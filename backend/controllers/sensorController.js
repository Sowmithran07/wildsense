import Sensor from '../models/Sensor.js';
import { emitSensorUpdate } from '../services/socketService.js';

// @desc    Get all sensors with optional filters
// @route   GET /api/sensors
// @access  Public / Private
export const getSensors = async (req, res, next) => {
  try {
    const { status, type, connectivity } = req.query;
    const query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (connectivity) query.connectivity = connectivity;

    const sensors = await Sensor.find(query).sort({ sensorId: 1 });
    res.json({ success: true, count: sensors.length, sensors });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single sensor by ID or sensorId
// @route   GET /api/sensors/:id
// @access  Public / Private
export const getSensorById = async (req, res, next) => {
  try {
    const sensor = await Sensor.findOne({
      $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { sensorId: req.params.id }],
    });

    if (!sensor) {
      return res.status(404).json({ success: false, message: 'Sensor not found.' });
    }

    res.json({ success: true, sensor });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new sensor
// @route   POST /api/sensors
// @access  Private (Admin)
export const createSensor = async (req, res, next) => {
  try {
    const {
      sensorId,
      name,
      type,
      locationName,
      latitude,
      longitude,
      batteryLevel = 100,
      signalStrength = 90,
      connectivity = 'online',
      status = 'active',
      solarCharging = true,
      sensitivity = 'High',
      notes = '',
    } = req.body;

    if (!name || !locationName || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide name, locationName, latitude, and longitude.' });
    }

    // Auto-generate sensorId if omitted
    let finalSensorId = sensorId;
    if (!finalSensorId) {
      const typePrefix = type?.includes('Camera') ? 'CAM' : type?.includes('Acoustic') ? 'MIC' : 'PIR';
      const count = await Sensor.countDocuments();
      finalSensorId = `SEN-${typePrefix}-${100 + count + 1}`;
    }

    const sensorExists = await Sensor.findOne({ sensorId: finalSensorId });
    if (sensorExists) {
      return res.status(400).json({ success: false, message: `Sensor with ID '${finalSensorId}' already exists.` });
    }

    const sensor = await Sensor.create({
      sensorId: finalSensorId,
      name,
      type: type || 'PIR Motion Sensor',
      locationName,
      latitude,
      longitude,
      batteryLevel,
      signalStrength,
      connectivity,
      status,
      solarCharging,
      sensitivity,
      notes,
      lastActive: new Date(),
    });

    emitSensorUpdate(sensor);

    res.status(201).json({ success: true, sensor });
  } catch (error) {
    next(error);
  }
};

// @desc    Update sensor
// @route   PUT /api/sensors/:id
// @access  Private (Admin / Officer)
export const updateSensor = async (req, res, next) => {
  try {
    const sensor = await Sensor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!sensor) {
      return res.status(404).json({ success: false, message: 'Sensor not found.' });
    }

    emitSensorUpdate(sensor);

    res.json({ success: true, sensor });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete sensor
// @route   DELETE /api/sensors/:id
// @access  Private (Admin)
export const deleteSensor = async (req, res, next) => {
  try {
    const sensor = await Sensor.findByIdAndDelete(req.params.id);

    if (!sensor) {
      return res.status(404).json({ success: false, message: 'Sensor not found.' });
    }

    res.json({ success: true, message: `Sensor '${sensor.sensorId}' deleted successfully.` });
  } catch (error) {
    next(error);
  }
};
