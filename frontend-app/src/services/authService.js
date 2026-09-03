// Authentication Service
// This file will contain API calls for authentication endpoints
// Currently prepared for future backend integration

const API_BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * Login user with email/phone and password
 * @param {Object} credentials - { identifier: string, password: string }
 * @returns {Promise} Response from login API
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Register new user
 * @param {Object} userData - { fullName: string, email: string, phone: string, password: string }
 * @returns {Promise} Response from register API
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Verify OTP code
 * @param {Object} otpData - { otp: string, emailOrPhone: string }
 * @returns {Promise} Response from OTP verification API
 */
export const verifyOTP = async (otpData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(otpData),
    });

    if (!response.ok) {
      throw new Error("OTP verification failed");
    }

    return await response.json();
  } catch (error) {
    console.error("OTP verification error:", error);
    throw error;
  }
};

/**
 * Resend OTP code
 * @param {Object} data - { emailOrPhone: string }
 * @returns {Promise} Response from resend OTP API
 */
export const resendOTP = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Resend OTP failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Resend OTP error:", error);
    throw error;
  }
};

/**
 * Forgot password request
 * @param {Object} data - { emailOrPhone: string }
 * @returns {Promise} Response from forgot password API
 */
export const forgotPassword = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Forgot password request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
};

/**
 * Reset password with token
 * @param {Object} data - { token: string, newPassword: string }
 * @returns {Promise} Response from reset password API
 */
export const resetPassword = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Reset password failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Reset password error:", error);
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise} Response from logout API
 */
export const logout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};