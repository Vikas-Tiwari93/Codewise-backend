import mongoose, { Model } from "mongoose";

const adsSchema = new mongoose.Schema(
  {
    adTitle: { type: String, required: true },
    adDescription: { type: String, required: true },
    logo: { type: String, required: true },
    billing: { type: String, required: true },
    advertiser: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export const Ads = mongoose.model("Ads", adsSchema);
