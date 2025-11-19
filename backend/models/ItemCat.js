import mongoose from "mongoose";
/**ItemCat Schema
 * Acts as a blueprint for how categorised item data is stored in MongoDB
 * supports consistent structure for item-category relationships as well as efficient querying
 * Helps prevent duplication through a compound uniqueness constraint
 * @field name - Item name (required, trimmed)
 * @field image - Image filename or path (required)
 * @field categoryId - reference to the item's category (required)
 * @field projectId - reference to the project the item belongs to (required)
 * @field lastupdated - timestamp for the last modification
 * @field timestamp - automatically manages createdAt and updatedAt fields
 * @index projectId + categoryId + name + image - Enforces uniqueness across project-category-item combinations
 */

const itemCatSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

itemCatSchema.index({ projectId: 1, categoryId: 1, name: 1, image: 1 }, { unique: true });

export default mongoose.models.ItemCat || mongoose.model("ItemCat", itemCatSchema);




