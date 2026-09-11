 import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  adminCode: { type: String }, // Stores the 15-digit code for admins

  // --- Settings Fields ---
  privacy: {
    showPhone: { type: Boolean, default: false },
    showHostel: { type: Boolean, default: true },
    requirePin: { type: Boolean, default: false }
  },
  address: {
    campus: { type: String, default: '' },
    hostelBlock: { type: String, default: '' },
    meetupSpot: { type: String, default: '' }
  },
  payment: {
    mode: { type: String, enum: ['UPI', 'Bank Account'], default: 'UPI' },
    upiId: { type: String, default: '' },
    accountName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' }
  },
  // --- Added Notification Preferences ---
  notifications: {
    priceDrops: { type: Boolean, default: true },
    orderPurchases: { type: Boolean, default: true },
    swapRequests: { type: Boolean, default: false },
    chatNotifications: { type: Boolean, default: true },
    meetupReminders: { type: Boolean, default: true }
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;