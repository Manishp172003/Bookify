import mongoose from "mongoose";

const platformSettingSchema = new mongoose.Schema(
  {
    commission: {
      type: Number,
      default: 5,
    },
    rentalCommission: {
      type: Number,
      default: 10,
    },
    exchangeFee: {
      type: Number,
      default: 20,
    },
    escrowDuration: {
      type: Number,
      default: 48,
    },
    allowRentals: {
      type: Boolean,
      default: true,
    },
    allowExchanges: {
      type: Boolean,
      default: true,
    },
    allowDonations: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const PlatformSetting = mongoose.model("PlatformSetting", platformSettingSchema);
export default PlatformSetting;
