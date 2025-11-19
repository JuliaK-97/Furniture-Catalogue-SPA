import mongoose from "mongoose";
/**ItemNew Schema
 * Acts as a blueprint for how item data is stored in MongoDB
 * supports consistent data acess and management across categories and projects
 * Helps prevent naming conflicts and ensures relational integrity
 * @field name - item name (required, trimmed)
 * @field image - image filename or path (required)
 * @field categoryId - reference to the item's category (required)
 * @field projectId - reference to the project the item belongs to (required)
 * @field lastupdated - timestamp for the last modification
 * @field timestamp - automatically manages createdAt and updatedAt fields
 */

const itemNewSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.ItemNew || mongoose.model("ItemNew", itemNewSchema);
