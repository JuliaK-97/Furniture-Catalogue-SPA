import mongoose from "mongoose";
/**
 * Catalogue schema
 * Defines the structure for storing generated catalogues linked to a project.
 * Captures metadata such as creator, creation date, and associated categories.
 * Supports traceability and documentation of catalogue generation.
 * @field projectName - Name of the project the catalogue belongs to (required, trimmed)
 * @field createdBy - identifier of who generated the catalogue (required)
 * @field createdAt - Timestamp of when the catalogue was created (defaults to current date)
 * @field categories - Array of references to Category documents included in the catalogue
 * @field notes - Optional notes or annotations related to the catalogue
 * @field timestamps - Automatically manages createdAt and updatedAt fields
 */

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
