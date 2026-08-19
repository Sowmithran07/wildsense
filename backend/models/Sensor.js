import mongoose from 'mongoose';
import { createModelProxy } from '../config/modelFactory.js';

const sensorSchema = new mongoose.Schema(
  {
    sensorId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['PIR Motion Sensor', 'Acoustic Sensor', 'Thermal Camera', 'Optical Camera', 'Seismic Sensor', 'GPS Module'],
      default: 'PIR Motion Sensor',
    },
    locationName: {
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
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 95,
    },
    signalStrength: {
      type: Number,
      min: 0,
      max: 100,
      default: 88,
    },
    connectivity: {
      type: String,
      enum: ['online', 'weak', 'offline'],
      default: 'online',
    },
    status: {
      type: String,
      enum: ['active', 'warning', 'maintenance', 'inactive'],
      default: 'active',
    },
    solarCharging: {
      type: Boolean,
      default: true,
    },
    temperature: {
      type: Number,
      default: 26.5,
    },
    sensitivity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Ultra'],
      default: 'High',
    },
    firmwareVersion: {
      type: String,
      default: 'v2.4.1-lora',
    },
    installationDate: {
      type: Date,
      default: Date.now,
    },
    lastMaintenanceDate: {
      type: Date,
      default: Date.now,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const MongooseSensor = mongoose.model('Sensor', sensorSchema);
const Sensor = createModelProxy('Sensor', MongooseSensor);
export default Sensor;
