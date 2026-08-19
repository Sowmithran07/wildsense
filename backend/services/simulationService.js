import Sensor from '../models/Sensor.js';
import { processIoTSensorTelemetry } from './iotService.js';
import { emitSimulationState } from './socketService.js';

let simulationInterval = null;
let isSimulationRunning = false;
let simulationIntervalSeconds = 30;

const SIMULATION_ANIMALS = [
  'Elephant',
  'Tiger',
  'Leopard',
  'Wild Boar',
  'Sloth Bear',
  'Spotted Deer',
  'Monkey',
  'Gaur',
];

export const startSimulation = (intervalSec = 30) => {
  if (isSimulationRunning) return { isRunning: true, intervalSeconds: simulationIntervalSeconds };

  simulationIntervalSeconds = intervalSec;
  isSimulationRunning = true;

  console.log(`[SIMULATOR] Real-time wildlife intrusion simulation started (Interval: ${intervalSec}s)`);

  simulationInterval = setInterval(async () => {
    try {
      await triggerSimulationTick();
    } catch (err) {
      console.error('[SIMULATOR] Error during tick:', err.message);
    }
  }, intervalSec * 1000);

  emitSimulationState({ isRunning: true, intervalSeconds: simulationIntervalSeconds });
  return { isRunning: true, intervalSeconds: simulationIntervalSeconds };
};

export const stopSimulation = () => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
  isSimulationRunning = false;
  console.log('[SIMULATOR] Real-time simulation stopped');
  emitSimulationState({ isRunning: false, intervalSeconds: simulationIntervalSeconds });
  return { isRunning: false };
};

export const getSimulationStatus = () => {
  return {
    isRunning: isSimulationRunning,
    intervalSeconds: simulationIntervalSeconds,
  };
};

export const triggerSimulationTick = async (forcedAnimal = null) => {
  const sensors = await Sensor.find({ status: { $in: ['active', 'warning'] } });
  if (!sensors.length) {
    console.warn('[SIMULATOR] No active sensors available for simulation.');
    return null;
  }

  // Pick a random sensor
  const sensor = sensors[Math.floor(Math.random() * sensors.length)];
  const animal = forcedAnimal || SIMULATION_ANIMALS[Math.floor(Math.random() * SIMULATION_ANIMALS.length)];

  // Slight natural battery discharge / solar fluctuations
  const batteryDelta = (Math.random() - 0.45) * 0.5;
  const newBattery = Math.max(10, Math.min(100, +(sensor.batteryLevel + batteryDelta).toFixed(1)));
  
  const soundLevel = animal === 'Elephant' || animal === 'Tiger' ? Math.floor(75 + Math.random() * 20) : Math.floor(55 + Math.random() * 20);
  const temp = +(24 + Math.random() * 6).toFixed(1);

  const telemetryResult = await processIoTSensorTelemetry({
    sensorId: sensor.sensorId,
    motionDetected: true,
    soundLevel,
    temperature: temp,
    batteryLevel: newBattery,
    signalStrength: Math.floor(75 + Math.random() * 25),
    latitude: sensor.latitude + (Math.random() - 0.5) * 0.004,
    longitude: sensor.longitude + (Math.random() - 0.5) * 0.004,
    timestamp: new Date(),
  });

  return telemetryResult;
};
