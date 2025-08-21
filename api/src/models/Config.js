import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  autoCloseEnabled: { type: Boolean, required: true, default: false },
  confidenceThreshold: { type: Number, required: true, min: 0, max: 1 },
  slaHours: { type: Number, required: true },
}, { timestamps: true });

const Config = mongoose.model("Config", configSchema);
export default Config;
