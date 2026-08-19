import mongoose from 'mongoose';
import { createModelProxy } from '../config/modelFactory.js';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['intrusion_alert', 'sensor_warning', 'sighting_update', 'system_notice', 'broadcast'],
      default: 'intrusion_alert',
    },
    threatLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'INFO'],
      default: 'INFO',
    },
    link: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const MongooseNotification = mongoose.model('Notification', notificationSchema);
const Notification = createModelProxy('Notification', MongooseNotification);
export default Notification;
