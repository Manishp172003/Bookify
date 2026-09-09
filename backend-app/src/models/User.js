 import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  adminCode: { type: String }, // Stores the 15-digit code for admins
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;