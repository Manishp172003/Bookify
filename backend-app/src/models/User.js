import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ─── Role-Based Access Control ────────────────────────────────────────────
  role: {
    type: String,
    enum: ['student', 'author', 'admin'],
    default: 'student',
  },
  isAdmin: { type: Boolean, default: false },
  isAuthor: { type: Boolean, default: false },
  hasStudentProfile: { type: Boolean, default: true },
  accountCategory: {
    type: String,
    enum: ['student_only', 'author_only', 'student_author', 'admin'],
    default: 'student_only',
  },
  adminCode: { type: String }, // 15-digit code for admin verification
  status: { type: String, enum: ['Active', 'Banned'], default: 'Active' },
  isBanned: { type: Boolean, default: false },

  // ─── Author Profile & Verification ────────────────────────────────────────
  authorProfile: {
    bio: { type: String, default: '' },
    avatar: { type: String, default: null },
    penName: { type: String, default: '' },
    website: { type: String, default: '' },
    socialLinks: {
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      github: { type: String, default: '' },
    },
    // Verification lifecycle: unverified → pending → verified | rejected
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified',
    },
    verificationDocs: {
      fullName: { type: String, default: '' },
      idDocUrl: { type: String, default: null },     // Cloudinary URL for govt ID
      degreeDocUrl: { type: String, default: null }, // Cloudinary URL for degree
      submittedAt: { type: Date, default: null },
      reviewNote: { type: String, default: '' },     // Admin rejection reason
    },
  },

  // ─── OTP Verification ────────────────────────────────────────────────────
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
  isPhoneVerified: { type: Boolean, default: false },

  // ─── Password Reset ───────────────────────────────────────────────────────
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },

  // ─── Author Profile & Verification Fields ──────────────────────────────
  isVerified: { type: Boolean, default: false },
  authorVerificationStatus: {
    type: String,
    enum: ['unverified', 'pending', 'verified', 'rejected'],
    default: 'unverified',
  },
  authorBio: { type: String, default: '' },
  penName: { type: String, default: '' },
  website: { type: String, default: '' },
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    goodreads: { type: String, default: '' },
    instagram: { type: String, default: '' },
  },
  publisherImprint: { type: String, default: '' },
  authorAvatar: { type: String, default: null },
  authorVerificationDocuments: [
    {
      title: { type: String },
      url: { type: String },
      fileName: { type: String, default: '' },
      fileType: { type: String, default: '' },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],

  // ─── Settings: Privacy ───────────────────────────────────────────────────
  privacy: {
    showPhone: { type: Boolean, default: false },
    showHostel: { type: Boolean, default: true },
    requirePin: { type: Boolean, default: false },
  },

  // ─── Settings: Address ───────────────────────────────────────────────────
  address: {
    campus: { type: String, default: '' },
    hostelBlock: { type: String, default: '' },
    meetupSpot: { type: String, default: '' },
  },

  // ─── Settings: Payment ───────────────────────────────────────────────────
  payment: {
    mode: { type: String, enum: ['UPI', 'Bank Account'], default: 'UPI' },
    upiId: { type: String, default: '' },
    accountName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
  },

  walletBalance: { type: Number, default: 0 },

  // ─── Settings: Notifications ─────────────────────────────────────────────
  notifications: {
    priceDrops: { type: Boolean, default: true },
    orderPurchases: { type: Boolean, default: true },
    swapRequests: { type: Boolean, default: false },
    chatNotifications: { type: Boolean, default: true },
    meetupReminders: { type: Boolean, default: true },
  },
}, { timestamps: true });

// Pre-save hook: keep isAdmin and role in sync
userSchema.pre('save', async function () {
  if (this.isModified('role')) {
    this.isAdmin = this.role === 'admin';
  } else if (this.isModified('isAdmin')) {
    if (this.isAdmin && this.role !== 'admin') {
      this.role = 'admin';
    }
  }
});

const User = mongoose.model('User', userSchema);
export default User;