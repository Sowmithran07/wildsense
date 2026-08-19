import mongoose from 'mongoose';
import { createModelProxy } from '../config/modelFactory.js';

const alertSchema = new mongoose.Schema(
  {
    alertId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    detection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AnimalDetection',
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
    distanceToVillageKm: {
      type: Number,
      default: 1.5,
    },
    status: {
      type: String,
      enum: ['new', 'acknowledged', 'in_progress', 'resolved'],
      default: 'new',
    },
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    acknowledgedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolvedAt: Date,
    broadcastRadiusKm: {
      type: Number,
      default: 3.5,
    },
    buzzerTriggered: {
      type: Boolean,
      default: true,
    },
    notificationsSent: {
      smsCount: { type: Number, default: 0 },
      emailCount: { type: Number, default: 0 },
      pushCount: { type: Number, default: 0 },
      inAppCount: { type: Number, default: 0 },
    },
    actionNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const MongooseAlert = mongoose.model('Alert', alertSchema);
const Alert = createModelProxy('Alert', MongooseAlert);
export default Alert;
