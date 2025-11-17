import mongoose from "mongoose";

const itemDetailSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ItemNew",
    required: true,
    unique: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Catalogue",
    required: true
  },
  condition: {
    type: String,
    enum: ["Good", "Fair", "Poor"],
    required: true
  },
  damageTypes: [{ type: String }],
  lotNumber: { type: String, required: true },
  location: {
    area: { type: String },
    zone: { type: String },
    floor: { type: String }
  },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.ItemDetail || mongoose.model("ItemDetail", itemDetailSchema);
