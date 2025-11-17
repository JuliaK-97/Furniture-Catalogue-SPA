import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  itemCount: { type: Number, default: 0 },
  categoryCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  status: { type: String, enum: ["open", "closed"], default: "open" }
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);

