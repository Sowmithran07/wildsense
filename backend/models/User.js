import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { createModelProxy } from '../config/modelFactory.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'officer', 'resident'],
      default: 'resident',
    },
    location: {
      name: { type: String, default: 'Bandipur Fringe Area' },
      latitude: { type: Number, default: 11.6664 },
      longitude: { type: Number, default: 76.6295 },
      radiusKm: { type: Number, default: 5 },
    },
    assignedZone: {
      type: String,
      default: 'Sector North - Buffer Zone 1',
    },
    badgeNumber: {
      type: String,
      default: '',
    },
    notificationPreferences: {
      sms: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const MongooseUser = mongoose.model('User', userSchema);
const User = createModelProxy('User', MongooseUser);
export default User;
