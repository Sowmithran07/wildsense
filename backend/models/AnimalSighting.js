import mongoose from 'mongoose';
import { createModelProxy } from '../config/modelFactory.js';

const animalSightingSchema = new mongoose.Schema(
  {
    sightingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reporterName: {
      type: String,
      required: true,
    },
    reporterPhone: {
      type: String,
      default: '',
    },
    animal: {
      type: String,
      required: true,
      enum: ['Elephant', 'Tiger', 'Leopard', 'Wild Boar', 'Sloth Bear', 'Spotted Deer', 'Monkey', 'Hyena', 'Gaur', 'Other / Unknown'],
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
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
    sightingTime: {
      type: Date,
      default: Date.now,
    },
    threatEstimate: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'dismissed'],
      default: 'pending',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verificationNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const MongooseAnimalSighting = mongoose.model('AnimalSighting', animalSightingSchema);
const AnimalSighting = createModelProxy('AnimalSighting', MongooseAnimalSighting);
export default AnimalSighting;
