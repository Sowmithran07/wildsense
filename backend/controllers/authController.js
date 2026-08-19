import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'wild_sense_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Register new user (Resident or Forest Officer)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role = 'resident', location, assignedZone, badgeNumber } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required registration fields.' });
    }

    // Protect admin registration from public signup
    if (role === 'admin') {
      const adminExists = await User.findOne({ role: 'admin' });
      if (adminExists) {
        return res.status(403).json({
          success: false,
          message: 'Admin registration is restricted. Please contact the Forest Department System Administrator.',
        });
      }
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      role,
      location: location || { name: 'Bandipur Fringe Area', latitude: 11.6664, longitude: 76.6295 },
      assignedZone: assignedZone || 'Sector North - Buffer Zone 1',
      badgeNumber: badgeNumber || '',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        assignedZone: user.assignedZone,
        badgeNumber: user.badgeNumber,
        notificationPreferences: user.notificationPreferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email and password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Please check your email and password.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        assignedZone: user.assignedZone,
        badgeNumber: user.badgeNumber,
        notificationPreferences: user.notificationPreferences,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - simulate token generation
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with this email address.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    console.log(`[AUTH] Password reset token generated for ${user.email}: ${resetToken}`);

    res.json({
      success: true,
      message: 'Password reset instructions dispatched to your email.',
      resetToken, // Returned for effortless demo/testing flow
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password with token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide token and new password.' });
    }

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully. You can now login with your new credentials.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all Forest Officers
// @route   GET /api/auth/officers
// @access  Private
export const getOfficers = async (req, res, next) => {
  try {
    const officers = await User.find({ role: { $in: ['officer', 'admin'] } }).select('-password');
    res.json({ success: true, count: officers.length, officers });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all Registered Residents
// @route   GET /api/auth/residents
// @access  Private (Admin / Officer)
export const getResidents = async (req, res, next) => {
  try {
    const residents = await User.find({ role: 'resident' }).select('-password');
    res.json({ success: true, count: residents.length, residents });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all Users
// @route   GET /api/auth/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};
