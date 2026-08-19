import Incident from '../models/Incident.js';
import Alert from '../models/Alert.js';
import { emitIncidentUpdate } from '../services/socketService.js';

// @desc    Get all incidents with search, filters, pagination
// @route   GET /api/incidents
// @access  Public / Private
export const getIncidents = async (req, res, next) => {
  try {
    const { status, threatLevel, animal, search, limit = 50, page = 1, sortBy = '-createdAt' } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (threatLevel && threatLevel !== 'all') query.threatLevel = threatLevel;
    if (animal && animal !== 'all') query.animal = animal;

    if (search) {
      query.$or = [
        { incidentId: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { animal: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Incident.countDocuments(query);
    const incidents = await Incident.find(query)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('detection')
      .populate('alert')
      .populate('assignedOfficer', 'name phone email role badgeNumber');

    res.json({
      success: true,
      count: incidents.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      incidents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single incident details dossier
// @route   GET /api/incidents/:id
// @access  Public / Private
export const getIncidentById = async (req, res, next) => {
  try {
    const incident = await Incident.findOne({
      $or: [{ _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }, { incidentId: req.params.id }],
    })
      .populate({
        path: 'detection',
        populate: { path: 'sensor' },
      })
      .populate('alert')
      .populate('assignedOfficer', 'name phone email role badgeNumber');

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident record not found.' });
    }

    res.json({ success: true, incident });
  } catch (error) {
    next(error);
  }
};

// @desc    Update incident status and details
// @route   PUT /api/incidents/:id
// @access  Private (Admin / Officer)
export const updateIncident = async (req, res, next) => {
  try {
    const { status, assignedOfficer, resolutionSummary, note } = req.body;
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident record not found.' });
    }

    const userName = req.user ? req.user.name : 'Officer';

    if (status) {
      incident.status = status;
      incident.actionTimeline.push({
        title: `Status Changed to ${status.toUpperCase()}`,
        description: note || `Incident status updated to ${status}`,
        user: userName,
        timestamp: new Date(),
      });

      if (status === 'resolved') {
        incident.resolvedAt = new Date();
        incident.resolutionSummary = resolutionSummary || note || 'Animal guided safely back into deep reserve core.';

        if (incident.alert) {
          await Alert.findByIdAndUpdate(incident.alert, {
            status: 'resolved',
            resolvedAt: new Date(),
            resolvedBy: req.user?._id,
          });
        }
      }
    }

    if (assignedOfficer) {
      incident.assignedOfficer = assignedOfficer;
    }

    if (resolutionSummary) {
      incident.resolutionSummary = resolutionSummary;
    }

    if (note) {
      incident.responseNotes.push({
        note,
        officer: req.user?._id,
        officerName: userName,
        timestamp: new Date(),
      });
    }

    await incident.save();
    emitIncidentUpdate(incident);

    const updatedIncident = await Incident.findById(incident._id)
      .populate('detection')
      .populate('alert')
      .populate('assignedOfficer', 'name phone email role badgeNumber');

    res.json({ success: true, incident: updatedIncident });
  } catch (error) {
    next(error);
  }
};

// @desc    Add response note from field officer
// @route   POST /api/incidents/:id/notes
// @access  Private (Admin / Officer)
export const addResponseNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    if (!note) {
      return res.status(400).json({ success: false, message: 'Please provide note text.' });
    }

    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident record not found.' });
    }

    const userName = req.user ? req.user.name : 'Patrol Guard';
    incident.responseNotes = incident.responseNotes || [];
    incident.actionTimeline = incident.actionTimeline || [];

    incident.responseNotes.push({
      note,
      officer: req.user?._id,
      officerName: userName,
      timestamp: new Date(),
    });

    incident.actionTimeline.push({
      title: 'Field Response Note Logged',
      description: note,
      user: userName,
      timestamp: new Date(),
    });

    await incident.save();
    emitIncidentUpdate(incident);

    res.status(201).json({ success: true, incident });
  } catch (error) {
    next(error);
  }
};
