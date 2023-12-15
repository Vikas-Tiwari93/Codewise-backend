import mongoose, { Model } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, required: true },
    organisation: [
      {
        orgName: { type: String, required: true },
        orgId: { type: String, required: true },
      },
    ],

    dob: { type: String, required: true },
    isAgreement: { type: Boolean, required: true },
    isActive: { type: Boolean, required: true },
    isDeleted: { type: Boolean, required: true },
    authToken: { type: String, required: true },
    securityQn: { type: String, required: true },
    devices: [
      {
        ipAddress: { type: String, required: true },
        deviceModel: { type: String, required: true },
        os: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);
userSchema.index({ userName: 1 }, { unique: true });
export const Users = mongoose.model("Student", userSchema);
