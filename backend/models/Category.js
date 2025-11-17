import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true, trim: true },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model("Category", categorySchema);



