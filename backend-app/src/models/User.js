import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      required: function () {
        return !this.googleId;
      },
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },

    location: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["student", "author", "admin"],
      default: "student",
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    adminCode: {
      type: String,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    resetToken: {
      type: String,
      default: null,
    },

    resetTokenExpiry: {
      type: Date,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    privacy: {
      showPhone: {
        type: Boolean,
        default: false,
      },

      showHostel: {
        type: Boolean,
        default: true,
      },

      requirePin: {
        type: Boolean,
        default: false,
      },
    },

    address: {
      campus: {
        type: String,
        default: "",
      },

      hostelBlock: {
        type: String,
        default: "",
      },

      meetupSpot: {
        type: String,
        default: "",
      },
    },

    payment: {
      mode: {
        type: String,
        enum: ["UPI", "Bank Account"],
        default: "UPI",
      },

      upiId: {
        type: String,
        default: "",
      },

      accountName: {
        type: String,
        default: "",
      },

      accountNumber: {
        type: String,
        default: "",
      },

      ifscCode: {
        type: String,
        default: "",
      },
    },

    notifications: {
      priceDrops: {
        type: Boolean,
        default: true,
      },

      orderPurchases: {
        type: Boolean,
        default: true,
      },

      swapRequests: {
        type: Boolean,
        default: false,
      },

      chatNotifications: {
        type: Boolean,
        default: true,
      },

      meetupReminders: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

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