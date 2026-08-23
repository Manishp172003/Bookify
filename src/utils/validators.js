export const validateLogin = (formData) => {
  const errors = {};

  if (!formData.identifier.trim()) {
    errors.identifier = "Email or phone number is required.";
  }

  if (!formData.password) {
    errors.password = "Password is required.";
  }

  return errors;
};


export const validateRegister = (formData) => {
  const errors = {};

  if (!formData.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!formData.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email.";
  }

  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^[0-9]{10}$/.test(formData.phone)) {
    errors.phone = "Enter a valid 10-digit phone number.";
  }

  if (!formData.password) {
    errors.password = "Password is required.";
  } else if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!formData.terms) {
    errors.terms = "Please accept the Terms & Conditions.";
  }

  return errors;
};


export const validateOTP = (otp) => {
  const errors = {};

  if (!otp || otp.length !== 6) {
    errors.otp = "Please enter the 6-digit OTP.";
  } else if (!/^[0-9]{6}$/.test(otp)) {
    errors.otp = "OTP must contain only numbers.";
  }

  return errors;
};