 import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register User (Without OTP)
export const register = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, phone, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User (Supports Email or Phone Number)
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find user by email or phone
    const user = await User.findOne({ 
      $or: [{ email: identifier }, { phone: identifier }] 
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email or phone' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        privacy: user.privacy,
        address: user.address,
        payment: user.payment
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Login with 15-digit code verification
export const adminLogin = async (req, res) => {
  try {
    const { email, password, code } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Not an administrator account.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (code !== user.adminCode) {
      return res.status(400).json({ message: 'Invalid 15-digit security verification code' });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: true }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Admin authenticated successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        privacy: user.privacy,
        address: user.address,
        payment: user.payment
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// --- New Controllers for Settings Tabs ---

// Update Privacy Settings
export const updatePrivacy = async (req, res) => {
  try {
    const userId = req.user.id; // Assumes you have an auth middleware setting req.user
    const { showPhone, showHostel, requirePin } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { privacy: { showPhone, showHostel, requirePin } } },
      { new: true }
    );

    res.status(200).json({ message: 'Privacy settings updated successfully', privacy: updatedUser.privacy });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Address Details
export const updateAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { campus, hostelBlock, meetupSpot } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { address: { campus, hostelBlock, meetupSpot } } },
      { new: true }
    );

    res.status(200).json({ message: 'Address details updated successfully', address: updatedUser.address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Payment Methods
export const updatePayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mode, upiId, accountName, accountNumber, ifscCode } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { payment: { mode, upiId, accountName, accountNumber, ifscCode } } },
      { new: true }
    );

    res.status(200).json({ message: 'Payment information updated successfully', payment: updatedUser.payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getUserSettings = async (req, res) => {
  try {
    // Assuming req.user.id is attached by your verifyToken middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      profile: {
        fullName: user.fullName || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || ''
      },
      payment: user.payment || { mode: 'UPI', upiId: '', accountNumber: '', ifscCode: '' }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update General User Profile (Name, Phone, etc.)
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { fullName, phone } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};