import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import { otpEmailTemplate, resetPasswordEmailTemplate } from "../utils/emailTemplates.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (payload, expiresIn = "7d") =>
  jwt.sign(payload, process.env.JWT_SECRET || "fallback_secret", { expiresIn });

const publicUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone || "",
  location: user.location || "",
  role: user.role || (user.isAdmin ? "admin" : "student"),
  isAdmin: user.isAdmin,
  isVerified: user.isVerified,
  isEmailVerified: user.isEmailVerified,
  authProvider: user.googleId ? "google" : "local",
  privacy: user.privacy,
  address: user.address,
  payment: user.payment,
  notifications: user.notifications,
});

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const issueOtp = async (user) => {
  const otp = generateOtp();
  user.otp = crypto.createHash("sha256").update(otp).digest("hex");
  user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Your Bookify verification code",
    htmlContent: otpEmailTemplate(user.fullName, otp),
  });
};

export const register = async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);

    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, phone and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: normalizedPhone },
      ],
    });

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }

      if (existingUser.phone === normalizedPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number already registered",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      role: "student",
      isAdmin: false,
      isEmailVerified: false,
      isPhoneVerified: false,
      isVerified: false,
    });

    try {
      await issueOtp(user);
    } catch (mailError) {
      console.error("OTP email failed:", mailError.message);

      return res.status(201).json({
        success: true,
        message:
          "Account created, but verification email could not be sent. Please request a new OTP.",
        emailSent: false,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      });
    }

    return res.status(201).json({
      success: true,
      message:
        "Account created. A verification code has been sent to your email.",
      emailSent: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number is already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: "Identifier and password are required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found with this email or phone" });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google Sign-In. Please continue with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.role || user.role === "student") {
      if (user.isAdmin) user.role = "admin";
    }

    const token = signToken({ id: user._id, role: user.role });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: "Google credential is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId, email_verified } = payload;

    if (!email_verified) {
      return res.status(400).json({ success: false, message: "Google email is not verified" });
    }

    let user = await User.findOne({ $or: [{ email }, { googleId }] });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
      }
      user.isEmailVerified = true;
      await user.save();
    } else {
      user = await User.create({
        fullName: name,
        email,
        googleId,
        role: "student",
        isEmailVerified: true,
      });
    }

    const token = signToken({ id: user._id, role: user.role });

    res.status(200).json({
      success: true,
      message: "Logged in with Google successfully",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "Google authentication failed", error: error.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password, code } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied. Not an administrator account." });
    }

    if (!user.password) {
      return res.status(400).json({ success: false, message: "Admin accounts must use a password login" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (code !== user.adminCode) {
      return res.status(400).json({ success: false, message: "Invalid 15-digit security verification code" });
    }

    user.role = "admin";
    await user.save();

    const token = signToken({ id: user._id, role: "admin" }, "1d");

    res.status(200).json({
      success: true,
      message: "Admin authenticated successfully",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const logout = async (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const genericResponse = {
    success: true,
    message: "If an account exists for that email, a reset link has been sent",
  };

  try {
    const { emailOrPhone } = req.body;

    if (!emailOrPhone) {
      return res.status(400).json({ success: false, message: "Email or phone is required" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user || !user.password) {
      return res.status(200).json(genericResponse);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your Bookify password",
        htmlContent: resetPasswordEmailTemplate(user.fullName, resetLink),
      });
    } catch (mailError) {
      console.error("Reset email failed:", mailError.message);
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();
      return res.status(502).json({
        success: false,
        message: "Could not send the reset email. Please try again shortly.",
      });
    }

    res.status(200).json(genericResponse);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: "Token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successfully. Please log in." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { emailOrPhone } = req.body;

    if (!emailOrPhone) {
      return res.status(400).json({ success: false, message: "Email or phone is required" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.otpExpiry && new Date(user.otpExpiry) - Date.now() > 9 * 60 * 1000) {
      return res.status(429).json({
        success: false,
        message: "A code was just sent. Please wait a minute before requesting another.",
      });
    }

    try {
      await issueOtp(user);
    } catch (mailError) {
      console.error("OTP email failed:", mailError.message);
      return res.status(502).json({
        success: false,
        message: "Could not send the verification email. Please try again shortly.",
      });
    }

    res.status(200).json({
      success: true,
      message: "A verification code has been sent to your email",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { emailOrPhone, otp } = req.body;

    if (!emailOrPhone || !otp) {
      return res.status(400).json({ success: false, message: "Email/phone and OTP are required" });
    }

    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ success: false, message: "No active code. Please request a new one." });
    }

    if (new Date(user.otpExpiry) < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    const hashedOtp = crypto.createHash("sha256").update(String(otp)).digest("hex");
    if (hashedOtp !== user.otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = signToken({ id: user._id, role: user.role });

    res.status(200).json({
      success: true,
      message: "Account verified successfully",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -otp -resetToken");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      profile: {
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        role: user.role || "student",
      },
      address: user.address || { campus: "", hostelBlock: "", meetupSpot: "" },
      payment: user.payment || { mode: "UPI", upiId: "", accountName: "", accountNumber: "", ifscCode: "" },
      privacy: user.privacy || { showPhone: false, showHostel: true, requirePin: false },
      notifications: user.notifications || {
        priceDrops: true,
        orderPurchases: true,
        swapRequests: false,
        chatNotifications: true,
        meetupReminders: true,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, phone, location } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { fullName, phone, location } },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        location: updatedUser.location || "",
        role: updatedUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePrivacy = async (req, res) => {
  try {
    const { showPhone, showHostel, requirePin } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { privacy: { showPhone, showHostel, requirePin } } },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Privacy settings updated successfully", privacy: updatedUser.privacy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { campus, hostelBlock, meetupSpot } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { address: { campus, hostelBlock, meetupSpot } } },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Address details updated successfully", address: updatedUser.address });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { mode, upiId, accountName, accountNumber, ifscCode } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { payment: { mode, upiId, accountName, accountNumber, ifscCode } } },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Payment information updated successfully", payment: updatedUser.payment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateNotifications = async (req, res) => {
  try {
    const { priceDrops, orderPurchases, swapRequests, chatNotifications, meetupReminders } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { notifications: { priceDrops, orderPurchases, swapRequests, chatNotifications, meetupReminders } } },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Notification preferences updated successfully", notifications: updatedUser.notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Both current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({ success: false, message: "This account uses Google Sign-In and has no password" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect current password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};