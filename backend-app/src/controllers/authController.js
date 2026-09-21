import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (payload, expiresIn = "7d") =>
  jwt.sign(payload, process.env.JWT_SECRET || "fallback_secret", { expiresIn });

/** Strips sensitive fields for the login/register response */
const publicUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  location: user.location || "",
  role: user.role || (user.isAdmin ? "admin" : "student"),
  isAdmin: user.isAdmin,
  isVerified: user.isVerified,
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
    });

    res.status(201).json({ success: true, message: "Account created successfully" });
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

    if (code && user.adminCode && code !== user.adminCode) {
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

// ─── Logout (stateless JWT — client discards token) ──────────────────────────

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

    if (!user) {
      // Do NOT reveal whether the account exists
      return res.status(200).json({
        success: true,
        message: "If an account exists, a reset link has been sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // In production: send email/SMS with reset link containing resetToken
    // For development: return the raw token in the response
    const isDev = process.env.NODE_ENV !== "production";

    res.status(200).json({
      success: true,
      message: "Password reset token generated",
      ...(isDev && { resetToken, note: "Token returned in dev mode only" }),
    });
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
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
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

// ─── Send / Resend OTP ────────────────────────────────────────────────────────

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

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

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // In production: send OTP via SMS (Twilio) or email (Brevo)
    const isDev = process.env.NODE_ENV !== "production";

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      ...(isDev && { otp, note: "OTP returned in dev mode only" }),
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

    // Mark phone as verified and clear OTP
    user.isPhoneVerified = true;
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

// ─── Switch Role ────────────────────────────────────────────────────────

/**
 * POST /api/auth/switch-role
 * Toggles the logged-in user between 'student' and 'author'.
 */
export const switchRole = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ success: false, message: "Admins cannot switch roles" });
    }

    const newRole = user.role === "student" ? "author" : "student";
    user.role = newRole;

    if (newRole === "author") {
      user.isAuthor = true;
      if (!user.authorProfile) user.authorProfile = {};
      if (!user.authorProfile.verificationStatus || user.authorProfile.verificationStatus === "unverified") {
        user.authorProfile.verificationStatus = "unverified";
      }
    }

    await user.save();

    const token = signToken({ id: user._id, role: user.role });

    return res.status(200).json({
      success: true,
      message: `Role switched to ${newRole} successfully`,
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Switch role error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// ─── Social OAuth Logins ───────────────────────────────────────────────────

/**
 * POST /api/auth/google
 */
export const googleLogin = async (req, res) => {
  try {
    const { email, fullName, avatar, googleId } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required for Google authentication" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await User.create({
        fullName: fullName || email.split("@")[0],
        email,
        phone: `+91${Date.now().toString().slice(-10)}`,
        password: hashedPassword,
        role: "student",
        isPhoneVerified: true,
        authorProfile: { avatar: avatar || null },
      });
    }

    const token = signToken({ id: user._id, role: user.role });

    return res.status(200).json({
      success: true,
      message: "Google login successful",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * POST /api/auth/github
 */
export const githubLogin = async (req, res) => {
  try {
    const { email, fullName, avatar, githubId } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required for GitHub authentication" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await User.create({
        fullName: fullName || email.split("@")[0],
        email,
        phone: `+91${Date.now().toString().slice(-10)}`,
        password: hashedPassword,
        role: "student",
        isPhoneVerified: true,
        authorProfile: { avatar: avatar || null },
      });
    }

    const token = signToken({ id: user._id, role: user.role });

    return res.status(200).json({
      success: true,
      message: "GitHub login successful",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("GitHub login error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};