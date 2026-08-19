import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { getIO } from './socketService.js';

export const sendSMS = async (phoneNumber, message) => {
  console.log(`[SMS GATEWAY DISPATCH] -> To: ${phoneNumber} | Message: "${message}"`);
  // Production integration point for Twilio / AWS SNS / Fast2SMS
  return { success: true, provider: 'Simulated-GSM-Gateway', timestamp: new Date() };
};

export const sendEmail = async (email, subject, htmlBody) => {
  console.log(`[EMAIL DISPATCH] -> To: ${email} | Subject: "${subject}"`);
  // Production integration point for Nodemailer / SendGrid / Resend
  return { success: true, provider: 'Simulated-SMTP', timestamp: new Date() };
};

export const sendPushNotification = async (fcmToken, payload) => {
  console.log(`[PUSH NOTIFICATION DISPATCH] -> Target: ${fcmToken || 'All Subscribers'} | Title: "${payload.title}"`);
  // Production integration point for Firebase Cloud Messaging (FCM) / Web Push
  return { success: true, provider: 'Simulated-FCM', timestamp: new Date() };
};

export const createInAppNotification = async ({
  userId,
  title,
  message,
  type = 'intrusion_alert',
  threatLevel = 'INFO',
  link = '',
  metadata = {},
}) => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      threatLevel,
      link,
      metadata,
    });

    const io = getIO();
    if (io) {
      if (userId) {
        io.to(`user-${userId}`).emit('NEW_NOTIFICATION', notification);
      } else {
        io.emit('NEW_NOTIFICATION', notification);
      }
    }

    return notification;
  } catch (error) {
    console.error('Failed to create in-app notification:', error.message);
    return null;
  }
};

export const broadcastIntrusionAlert = async ({ alert, detection }) => {
  try {
    // 1. Fetch relevant users (Officers & nearby residents)
    const officers = await User.find({ role: { $in: ['admin', 'officer'] } });
    const residents = await User.find({ role: 'resident' });

    const title = `🚨 [${alert.threatLevel}] Wildlife Intrusion: ${alert.animal}`;
    const message = `${alert.animal} detected at ${alert.location} (~${alert.distanceToVillageKm} km from settlement). Threat Level: ${alert.threatLevel}.`;

    // 2. Dispatch notifications to all officers
    for (const officer of officers) {
      await createInAppNotification({
        userId: officer._id,
        title,
        message,
        type: 'intrusion_alert',
        threatLevel: alert.threatLevel,
        link: `/alerts`,
        metadata: { alertId: alert.alertId, detectionId: detection?.detectionId },
      });

      if (officer.notificationPreferences?.sms && officer.phone) {
        await sendSMS(officer.phone, `[WILD SENSE DISPATCH] ${title} - ${alert.location}. Please open app to coordinate.`);
      }
    }

    // 3. Dispatch to residents if HIGH or CRITICAL
    if (alert.threatLevel === 'HIGH' || alert.threatLevel === 'CRITICAL') {
      for (const resident of residents) {
        await createInAppNotification({
          userId: resident._id,
          title: `⚠️ WILDLIFE PROXIMITY ALERT: ${alert.animal}`,
          message: `Caution: ${alert.animal} spotted near ${alert.location}. Please stay indoors, secure cattle, and remain vigilant.`,
          type: 'intrusion_alert',
          threatLevel: alert.threatLevel,
          link: `/resident-portal`,
          metadata: { alertId: alert.alertId },
        });

        if (resident.notificationPreferences?.sms && resident.phone) {
          await sendSMS(resident.phone, `[WILD SENSE RESIDENT ALERT] Caution! ${alert.animal} near ${alert.location}. Stay inside.`);
        }
      }
    }

    // Update alert counts
    alert.notificationsSent = {
      smsCount: (officers.length + (alert.threatLevel === 'HIGH' || alert.threatLevel === 'CRITICAL' ? residents.length : 0)),
      emailCount: officers.length,
      pushCount: officers.length + residents.length,
      inAppCount: officers.length + residents.length,
    };
    await alert.save();

  } catch (error) {
    console.error('Error broadcasting intrusion alert:', error.message);
  }
};
