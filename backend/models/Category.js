import mongoose from "mongoose";
/**Category schema
 * acts as a blueprint for how category data will be stored in MongoDB
 * allows easier data access and management
 * helps prevent naming conflicts
 * @field categroyName - Category name (required, unique, trimmed)
 * @field lastupdated - timestamp for the last modification
 * @field timestamp - automatically manage updatedAt and createdAt fields
 */

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true, trim: true },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model("Category", categorySchema);



