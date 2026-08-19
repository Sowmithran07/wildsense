import {
  startSimulation,
  stopSimulation,
  getSimulationStatus,
  triggerSimulationTick,
} from '../services/simulationService.js';

// @desc    Toggle simulation mode on/off
// @route   POST /api/simulation/toggle
// @access  Public / Private
export const toggleSimulation = async (req, res, next) => {
  try {
    const { enable, interval = 30 } = req.body;
    const currentStatus = getSimulationStatus();

    let result;
    if (enable === true || (enable === undefined && !currentStatus.isRunning)) {
      result = startSimulation(interval);
    } else {
      result = stopSimulation();
    }

    res.json({
      success: true,
      simulation: result,
      message: result.isRunning ? `Simulation activated (Interval: ${result.intervalSeconds}s)` : 'Simulation deactivated',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger instant manual intrusion
// @route   POST /api/simulation/trigger-manual
// @access  Public / Private
export const triggerManualIntrusion = async (req, res, next) => {
  try {
    const { animal } = req.body;
    const result = await triggerSimulationTick(animal);

    if (!result) {
      return res.status(400).json({ success: false, message: 'Failed to simulate intrusion. Ensure active sensors exist.' });
    }

    res.json({
      success: true,
      message: `Manual intrusion of ${result.detection?.animal || 'wildlife'} generated successfully.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get simulation status
// @route   GET /api/simulation/status
// @access  Public / Private
export const getStatus = async (req, res, next) => {
  try {
    const status = getSimulationStatus();
    res.json({ success: true, ...status });
  } catch (error) {
    next(error);
  }
};
