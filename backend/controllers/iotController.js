import { processIoTSensorTelemetry } from '../services/iotService.js';

// @desc    Ingest raw hardware IoT sensor telemetry
// @route   POST /api/iot/sensor-data
// @access  Public (Hardware token validated in future)
export const ingestSensorData = async (req, res, next) => {
  try {
    const {
      sensorId,
      motionDetected,
      soundLevel,
      temperature,
      batteryLevel,
      signalStrength,
      latitude,
      longitude,
      imageData,
      timestamp,
    } = req.body;

    if (!sensorId) {
      return res.status(400).json({
        success: false,
        message: 'sensorId is required for IoT telemetry ingestion.',
      });
    }

    const result = await processIoTSensorTelemetry({
      sensorId,
      motionDetected,
      soundLevel,
      temperature,
      batteryLevel,
      signalStrength,
      latitude,
      longitude,
      imageData,
      timestamp,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
