import AnimalSighting from '../models/AnimalSighting.js';
import { getAnimalImage } from '../services/animalRecognitionService.js';
import { createInAppNotification } from '../services/notificationService.js';
import User from '../models/User.js';

// @desc    Get all animal sightings
// @route   GET /api/sightings
// @access  Public / Private
export const getSightings = async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;

    const total = await AnimalSighting.countDocuments(query);
    const sightings = await AnimalSighting.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('reportedBy', 'name phone email role')
      .populate('verifiedBy', 'name role');

    res.json({
      success: true,
      count: sightings.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      sightings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Report an animal sighting (Resident)
// @route   POST /api/sightings
// @access  Private / Public
export const createSighting = async (req, res, next) => {
  try {
    const {
      animal,
      description,
      image,
      locationName,
      latitude,
      longitude,
      reporterName,
      reporterPhone,
      threatEstimate = 'MEDIUM',
    } = req.body;

    if (!animal || !description || !locationName) {
      return res.status(400).json({ success: false, message: 'Please provide animal, description, and location.' });
    }

    const count = await AnimalSighting.countDocuments();
    const sightingId = `SGT-${new Date().getFullYear()}-${String(count + 101).padStart(4, '0')}`;

    const sighting = await AnimalSighting.create({
      sightingId,
      reportedBy: req.user ? req.user._id : null,
      reporterName: req.user ? req.user.name : reporterName || 'Anonymous Resident',
      reporterPhone: req.user ? req.user.phone : reporterPhone || '',
      animal,
      description,
      image: image || getAnimalImage(animal),
      locationName,
      latitude: latitude || 11.6664 + (Math.random() - 0.5) * 0.01,
      longitude: longitude || 76.6295 + (Math.random() - 0.5) * 0.01,
      threatEstimate,
      status: 'pending',
    });

    // Notify Forest Officers about community report
    const officers = await User.find({ role: { $in: ['admin', 'officer'] } });
    for (const officer of officers) {
      await createInAppNotification({
        userId: officer._id,
        title: `Community Sighting Report: ${animal}`,
        message: `${sighting.reporterName} reported a ${animal} sighting near ${locationName}. Verification required.`,
        type: 'sighting_update',
        threatLevel: threatEstimate,
        link: '/sightings',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your wildlife sighting report has been submitted for ranger verification.',
      sighting,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify or dismiss sighting
// @route   PUT /api/sightings/:id/status
// @access  Private (Admin / Officer)
export const updateSightingStatus = async (req, res, next) => {
  try {
    const { status, verificationNotes } = req.body;
    const sighting = await AnimalSighting.findById(req.params.id);

    if (!sighting) {
      return res.status(404).json({ success: false, message: 'Sighting record not found.' });
    }

    sighting.status = status;
    sighting.verifiedBy = req.user ? req.user._id : null;
    if (verificationNotes) sighting.verificationNotes = verificationNotes;

    await sighting.save();

    // If verified, notify the resident
    if (sighting.reportedBy) {
      await createInAppNotification({
        userId: sighting.reportedBy,
        title: `Sighting Report ${status.toUpperCase()}`,
        message: `Your report for ${sighting.animal} has been marked as ${status} by the Forest Department. ${verificationNotes || ''}`,
        type: 'sighting_update',
        link: '/resident-portal',
      });
    }

    res.json({ success: true, sighting });
  } catch (error) {
    next(error);
  }
};
