import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  items: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  project: {                                
    type: mongoose.Schema.Types.ObjectId,   
    ref: "Project",                         
    required: true                         
  }

}, { timestamps: true });

export default mongoose.models.Category || mongoose.model("Category", categorySchema);

