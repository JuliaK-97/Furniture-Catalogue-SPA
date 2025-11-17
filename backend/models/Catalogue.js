import mongoose from "mongoose";

const catalogueSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }],
  notes: {
    type: String
  }
}, { timestamps: true });

export default mongoose.models.Catalogue || mongoose.model("Catalogue", catalogueSchema);
