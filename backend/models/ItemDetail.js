import mongoose from "mongoose";
/**ItemDetail Schema
 * acts as a blueprint for how an items details are stored in MongoDB
 * supports consistent data access and management across projects
 * @field itemId - reference to the item the details belong to (required, unique)
 * @field projectId - reference to the project the item detail belongs to (required)
 * @field condition - reference to the condition of the item ("Good", "Fair", "Poor", required)
 * @field damageTypes - reference to the item's condition, specifically the damage if it is given the condition "Fair" or "Poor"
 * @field lotNumber - automatically generated lot number for each item (required)
 * @field location - reference to the item's location (physical) in three areas ("area", "zone", "floor", required)
 * @field lastUpdated - Timestamp for last modification
 * @field timestamps - Automatically manages createdAt and updatedAt fields
 */

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
