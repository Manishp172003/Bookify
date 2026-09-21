import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  location: { type: String, default: '' },
  password: { type: String, required: true },

  // ---- Role-Based Access Control ----
  // 'role' is the primary authorization field used by middleware.
  // 'isAdmin' is kept for backward compatibility.
  role: {
    type: String,
    enum: ['student', 'author', 'admin'],
    default: 'student',
  },
  isAdmin: { type: Boolean, default: false },
  adminCode: { type: String }, // 15-digit code for admin verification

  // ---- OTP Verification Fields ----
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
  isPhoneVerified: { type: Boolean, default: false },

  // ---- Password Reset Fields ----
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },

  // ---- Author Verification ----
  isVerified: { type: Boolean, default: false },

  // ---- Settings: Privacy ----
  privacy: {
    showPhone: { type: Boolean, default: false },
    showHostel: { type: Boolean, default: true },
    requirePin: { type: Boolean, default: false },
  },

  // ---- Settings: Address ----
  address: {
    campus: { type: String, default: '' },
    hostelBlock: { type: String, default: '' },
    meetupSpot: { type: String, default: '' },
  },

  // ---- Settings: Payment ----
  payment: {
    mode: { type: String, enum: ['UPI', 'Bank Account'], default: 'UPI' },
    upiId: { type: String, default: '' },
    accountName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
  },

  // ---- Settings: Notification Preferences ----
  notifications: {
    priceDrops: { type: Boolean, default: true },
    orderPurchases: { type: Boolean, default: true },
    swapRequests: { type: Boolean, default: false },
    chatNotifications: { type: Boolean, default: true },
    meetupReminders: { type: Boolean, default: true },
  },
}, { timestamps: true });

userSchema.pre("save", function () {
  if (this.isModified("role")) {
    this.isAdmin = this.role === "admin";
  } else if (this.isModified("isAdmin")) {
    if (this.isAdmin && this.role !== "admin") {
      this.role = "admin";
    }
  }
});

const User = mongoose.model("User", userSchema);

export default User;