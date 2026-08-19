import Notification from '../models/Notification.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private / Public
export const getNotifications = async (req, res, next) => {
  try {
    const query = {};
    if (req.user) {
      query.$or = [{ user: req.user._id }, { user: null }];
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(30);
    const unreadCount = await Notification.countDocuments({ ...query, isRead: false });

    res.json({ success: true, count: notifications.length, unreadCount, notifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }
    res.json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllNotificationsRead = async (req, res, next) => {
  try {
    const query = {};
    if (req.user) {
      query.$or = [{ user: req.user._id }, { user: null }];
    }
    await Notification.updateMany(query, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    next(error);
  }
};
