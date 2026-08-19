import Alert from '../models/Alert.js';
import Incident from '../models/Incident.js';
import { emitIncidentUpdate } from '../services/socketService.js';

// @desc    Get all alerts with filtering
// @route   GET /api/alerts
// @access  Public / Private
export const getAlerts = async (req, res, next) => {
  try {
    const { status, threatLevel, limit = 50, page = 1 } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (threatLevel && threatLevel !== 'all') query.threatLevel = threatLevel;

    const total = await Alert.countDocuments(query);
    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('detection')
      .populate('assignedOfficer', 'name phone email role badgeNumber')
      .populate('acknowledgedBy', 'name email role')
      .populate('resolvedBy', 'name email role');

    res.json({
      success: true,
      count: alerts.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      alerts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single alert
// @route   GET /api/alerts/:id
// @access  Public / Private
export const getAlertById = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id)
      .populate('detection')
      .populate('assignedOfficer', 'name phone email role badgeNumber')
      .populate('acknowledgedBy', 'name role')
      .populate('resolvedBy', 'name role');

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found.' });
    }

    res.json({ success: true, alert });
  } catch (error) {
    next(error);
  }
};

// @desc    Update alert status (Acknowledge, In Progress, Resolve)
// @route   PUT /api/alerts/:id/status
// @access  Private (Admin / Officer)
export const updateAlertStatus = async (req, res, next) => {
  try {
    const { status, actionNotes } = req.body;
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found.' });
    }

    alert.status = status;
    if (actionNotes) alert.actionNotes = actionNotes;

    const userId = req.user ? req.user._id : null;
    const userName = req.user ? req.user.name : 'Forest Officer';

    if (status === 'acknowledged' && !alert.acknowledgedAt) {
      alert.acknowledgedBy = userId;
      alert.acknowledgedAt = new Date();
    } else if (status === 'resolved') {
      alert.resolvedBy = userId;
      alert.resolvedAt = new Date();
    }

    await alert.save();

    // Update corresponding incident status if linked
    const incident = await Incident.findOne({ alert: alert._id });
    if (incident) {
      incident.status = status === 'resolved' ? 'resolved' : status === 'acknowledged' ? 'investigating' : incident.status;
      incident.actionTimeline.push({
        title: `Alert Status Changed to ${status.toUpperCase()}`,
        description: actionNotes || `Status updated by ${userName}.`,
        user: userName,
        timestamp: new Date(),
      });
      if (status === 'resolved') {
        incident.resolvedAt = new Date();
        incident.resolutionSummary = actionNotes || 'Intrusion successfully mitigated and contained.';
      }
      await incident.save();
      emitIncidentUpdate(incident);
    }

    res.json({ success: true, alert, incident });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign officer to alert
// @route   PUT /api/alerts/:id/assign
// @access  Private (Admin / Officer)
export const assignOfficer = async (req, res, next) => {
  try {
    const { officerId, notes } = req.body;
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ success: false, message: 'Alert not found.' });
    }

    alert.assignedOfficer = officerId;
    if (alert.status === 'new') alert.status = 'in_progress';
    if (notes) alert.actionNotes = notes;
    await alert.save();

    const incident = await Incident.findOne({ alert: alert._id });
    if (incident) {
      incident.assignedOfficer = officerId;
      if (incident.status === 'open') incident.status = 'investigating';
      incident.actionTimeline.push({
        title: 'Officer Assigned to Incident',
        description: `Officer assigned to coordinate ground response. ${notes || ''}`,
        user: req.user ? req.user.name : 'Dispatcher',
        timestamp: new Date(),
      });
      await incident.save();
      emitIncidentUpdate(incident);
    }

    const populatedAlert = await Alert.findById(alert._id)
      .populate('assignedOfficer', 'name phone email role badgeNumber')
      .populate('detection');

    res.json({ success: true, alert: populatedAlert });
  } catch (error) {
    next(error);
  }
};
