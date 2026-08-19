import mongoose from 'mongoose';
import { createModelProxy } from '../config/modelFactory.js';

const responseNoteSchema = new mongoose.Schema(
  {
    note: {
      type: String,
      required: true,
    },
    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    officerName: {
      type: String,
      default: 'Rapid Response Ranger',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const actionTimelineSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    user: {
      type: String,
      default: 'System AI Engine',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const incidentSchema = new mongoose.Schema(
  {
    incidentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    detection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AnimalDetection',
    },
    alert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Alert',
    },
    animal: {
      type: String,
      required: true,
    },
    threatLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'investigating', 'contained', 'resolved'],
      default: 'open',
    },
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    responseNotes: [responseNoteSchema],
    actionTimeline: [actionTimelineSchema],
    resolutionSummary: {
      type: String,
      default: '',
    },
    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
);

const MongooseIncident = mongoose.model('Incident', incidentSchema);
const Incident = createModelProxy('Incident', MongooseIncident);
export default Incident;
