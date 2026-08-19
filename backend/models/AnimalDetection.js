import mongoose from 'mongoose';
import { createModelProxy } from '../config/modelFactory.js';

const animalDetectionSchema = new mongoose.Schema(
  {
    detectionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    animal: {
      type: String,
      required: true,
      enum: ['Elephant', 'Tiger', 'Leopard', 'Wild Boar', 'Sloth Bear', 'Spotted Deer', 'Monkey', 'Hyena', 'Gaur', 'Unknown'],
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
      default: 92.5,
    },
    image: {
      type: String,
      default: '',
    },
    sensor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sensor',
    },
    sensorId: {
      type: String,
      required: true,
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
    threatLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      required: true,
      default: 'MEDIUM',
    },
    aiModelVersion: {
      type: String,
      default: 'WildVision-YOLOv8-Ensemble-v3.2',
    },
    movementSpeedKmH: {
      type: Number,
      default: 8.5,
    },
    headingDirection: {
      type: String,
      default: 'East towards Gundlupet Sector',
    },
    distanceToVillageKm: {
      type: Number,
      default: 1.2,
    },
    rawSensorData: {
      motionDetected: { type: Boolean, default: true },
      soundDecibels: { type: Number, default: 68 },
      thermalDiffCelsius: { type: Number, default: 8.4 },
      vibrationFreqHz: { type: Number, default: 14.2 },
    },
    detectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const MongooseDetection = mongoose.model('AnimalDetection', animalDetectionSchema);
const AnimalDetection = createModelProxy('AnimalDetection', MongooseDetection);
export default AnimalDetection;
