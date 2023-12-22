import mongoose, { Model } from "mongoose";
const donationSchema = new mongoose.Schema(
  {
    donorId: { type: String, required: true },
    amount: { type: Number, required: true },
    donationDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
