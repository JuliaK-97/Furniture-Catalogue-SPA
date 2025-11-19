import mongoose from "mongoose";
/**Project schema
 * acts as a blueprint for how data will be stored in MongoDB
 * allows easier data access and management
 * helps prevent naming conflicts
 * @field name - Project name (required)
 * @field itemCount -number of items in the projects
 * @field categoryCount - universal category count shared across all projects
 * @field status - the project status ("open" or "closed")
 * @field timestamp - automatically manage updatedAt and createdAt fields
 */

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  itemCount: { type: Number, default: 0 },
  categoryCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  status: { type: String, enum: ["open", "closed"], default: "open" }
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);

