/**
 * Item Routes
 * Handles all backend operations related to item management within the application.
 * Features:
 * -Supports image uploads via Multer
 * -Includes CRUD endpoints for items
 * -Integrates with Project and Category models through population
 * -Ensures related item-category representations are created (via ItemCat upsert)
 */
import express from "express";
import multer from "multer";
import ItemNew from "../models/ItemNew.js";
import ItemCat from "../models/ItemCat.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });
/**
 * @route POST /items
 * @description
 * Creates a new item record. Supports image upload using Multer.
 * If an image is provided, it is stored on the server under /uploads/.
 * Also ensures that a corresponding ItemCat record exists via upsert.
 * @param {string} req.body.name - The name of the item.
 * @param {string} req.body.categoryId - The ID of the associated category.
 * @param {string} req.body.projectId - The ID of the associated project.
 * @param {File} [req.file] - Optional uploaded image file.
 * @returns {Object} 201 - The newly created item object.
 * @returns {Object} 400 - Validation or save error details.
 */
router.post("/items", upload.single("image"), async (req, res) => {
  try {
    const { name, categoryId, projectId } = req.body;
    const imagePath = req.file ? "/uploads/" + req.file.filename : null;
    const item = new ItemNew({ name, image: imagePath, categoryId, projectId });
    await item.save();
    await ItemCat.updateOne(
      { projectId, categoryId, name, image: imagePath },
      { $setOnInsert: { projectId, categoryId, name, image: imagePath, lastUpdated: Date.now() } },
      { upsert: true }
    );
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/**
 * @route GET /items
 * @description
 * Retrieves a list of items. Supports optional filtering by projectId and categoryId. 
 * Returned items include populated project and category details, sorted by newest first.
 * @param {string} [req.query.projectId] - Optional project filter.
 * @param {string} [req.query.categoryId] - Optional category filter.
 * @returns {Object[]} 200 - Array of matching item objects.
 * @returns {Object} 500 - Server error.
 */

router.get("/items", async (req, res) => {
  try {
    const { projectId, categoryId } = req.query;
    const query = {};
    if (projectId) query.projectId = projectId;
    if (categoryId) query.categoryId = categoryId;
    const items = await ItemNew.find(query)
      .populate("projectId")
      .populate("categoryId")
      .sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/**
 * @route GET /items/:id
 * @description
 * Retrieves a single item by its unique ID, including populated project and category details.
 * @param {string} req.params.id - The ID of the item to retrieve.
 * @returns {Object} 200 - The requested item.
 * @returns {Object} 404 - Error if the item does not exist.
 * @returns {Object} 400 - Error if the ID is invalid.
 */

router.get("/items/:id", async (req, res) => {
  try {
    const item = await ItemNew.findById(req.params.id)
      .populate("projectId")
      .populate("categoryId");
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.status(200).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/**
 * @route PATCH /items/:id
 * @description
 * Updates an existing item. Any provided fields in the request body will be updated. Automatically sets the `lastUpdated` timestamp.
 * @param {string} req.params.id - The ID of the item to update.
 * @param {Object} req.body - The fields to update.
 * @returns {Object} 200 - The updated item.
 * @returns {Object} 404 - Error if the item is not found.
 * @returns {Object} 400 - Validation or update error.
 */
router.patch("/items/:id", async (req, res) => {
  try {
    const updated = await ItemNew.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Item not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/**
 * @route DELETE /items/:id
 * @description
 * Deletes an item by its ID.
 * @param {string} req.params.id - The ID of the item to delete.
 * @returns {Object} 200 - Confirmation message.
 * @returns {Object} 404 - Error if the item does not exist.
 * @returns {Object} 400 - Error if deletion fails or ID is invalid.
 */

router.delete("/items/:id", async (req, res) => {
  try {
    const deleted = await ItemNew.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Item not found" });
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;

