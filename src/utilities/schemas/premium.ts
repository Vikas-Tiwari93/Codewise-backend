import mongoose, { Model } from "mongoose";

const premiumMemberSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    subscriptionType: { type: String, required: true },
    billed: { type: String, required: true },
    receipt: { type: String, required: true },
    subscriptionStartDate: { type: Date, required: true },
    subscriptionEndDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export const PremiumMember = mongoose.model(
  "PremiumMembers",
  premiumMemberSchema
);
