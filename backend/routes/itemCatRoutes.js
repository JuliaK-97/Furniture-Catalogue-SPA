/**
 * ItemCat Routes
 * Handles backend operations for catalogue item entries, including:
 * - Creating and retrieving catalogue/project items
 * - Updating and deleting catalogue item entries
 * - Confirming catalogue items to generate actual items (ItemNew)
 * Features:
 * - Supports filtering by projectId and categoryId
 * - Maintains lastUpdated timestamp on updates
 * - Prevents duplicate catalogue entries (returns 409 on duplicate)
 */
import express from "express";
import ItemCat from "../models/ItemCat.js";
import ItemNew from "../models/ItemNew.js";

const router = express.Router();
/**
 * @route GET /itemCats
 * @description
 * Retrieves all catalogue item entries, optionally filtered by projectId or categoryId.
 * Populates projectId and categoryId references and sorts by creation date (newest first).
 * @param {string} [req.query.projectId] - Optional project ID to filter items.
 * @param {string} [req.query.categoryId] - Optional category ID to filter items.
 * @returns {Object[]} 200 - Array of catalogue item objects.
 * @returns {Object} 500 - Server error.
 */
router.get("/itemCats", async (req, res) => {
  try {
    const { projectId, categoryId } = req.query;
    const query = {};
    if (projectId) query.projectId = projectId;
    if (categoryId) query.categoryId = categoryId;
    const itemCats = await ItemCat.find(query)
      .populate("projectId")
      .populate("categoryId")
      .sort({ createdAt: -1 });
    res.status(200).json(itemCats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/**
 * @route POST /itemCats
 * @description
 * Creates a new catalogue item entry with a name, image, categoryId, and projectId.
 * Prevents duplicate entries and returns a 409 status if already exists.
 * @param {string} req.body.name - Name of the catalogue item.
 * @param {string} req.body.image - Optional image URL/path.
 * @param {string} req.body.categoryId - The ID of the category.
 * @param {string} req.body.projectId - The ID of the project.
 * @returns {Object} 201 - The newly created catalogue item entry.
 * @returns {Object} 409 - Duplicate entry error.
 * @returns {Object} 400 - Validation or save error.
 */
router.post("/itemCats", async (req, res) => {
  try {
    const { name, image, categoryId, projectId } = req.body;
    const itemCat = new ItemCat({ name, image, categoryId, projectId });
    await itemCat.save();
    res.status(201).json(itemCat);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Catalogue item entry already exists" });
    }
    res.status(400).json({ error: err.message });
  }
});
/**
 * @route GET /itemCats/:id
 * @description
 * Retrieves a specific catalogue item entry by its unique ID.
 * Populates projectId and categoryId references.
 * @param {string} req.params.id - The ID of the catalogue item entry.
 * @returns {Object} 200 - The requested catalogue item entry.
 * @returns {Object} 404 - Entry not found.
 * @returns {Object} 400 - Invalid ID or query error.
 */

router.get("/itemCats/:id", async (req, res) => {
  try {
    const itemCat = await ItemCat.findById(req.params.id)
      .populate("projectId")
      .populate("categoryId");
    if (!itemCat) return res.status(404).json({ error: "Catalogue item entry not found" });
    res.status(200).json(itemCat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/**
 * @route PATCH /itemCats/:id
 * @description
 * Updates an existing catalogue item entry with the provided fields.
 * Automatically sets the `lastUpdated` timestamp.
 * @param {string} req.params.id - The ID of the catalogue item to update.
 * @param {Object} req.body - Fields to update (e.g., name, image, categoryId, projectId).
 * @returns {Object} 200 - The updated catalogue item entry.
 * @returns {Object} 404 - Entry not found.
 * @returns {Object} 400 - Validation or update error.
 */

router.patch("/itemCats/:id", async (req, res) => {
  try {
    const updated = await ItemCat.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Catalogue item entry not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/**
 * @route DELETE /itemCats/:id
 * @description
 * Deletes a catalogue item entry by its unique ID.
 * @param {string} req.params.id - The ID of the catalogue item entry to delete.
 * @returns {Object} 200 - Confirmation message.
 * @returns {Object} 404 - Entry not found.
 * @returns {Object} 400 - Deletion or validation error.
 */

router.delete("/itemCats/:id", async (req, res) => {
  try {
    const deleted = await ItemCat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Catalogue item entry not found" });
    res.status(200).json({ message: "Catalogue item entry deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/**
 * @route POST /itemCats/:id/confirm
 * @description
 * Confirms a catalogue item entry and generates a corresponding ItemNew record using the name, image, categoryId, and projectId from the catalogue item entry.
 * @param {string} req.params.id - The ID of the catalogue item to confirm.
 * @returns {Object} 201 - Newly created ItemNew record.
 * @returns {Object} 404 - Entry not found.
 * @returns {Object} 400 - Validation or save error.
 */

router.post("/itemCats/:id/confirm", async (req, res) => {
  try {
    const itemCat = await ItemCat.findById(req.params.id);
    if (!itemCat) return res.status(404).json({ error: "Catalogue item entry not found" });
    const item = new ItemNew({
      name: itemCat.name,
      image: itemCat.image,
      categoryId: itemCat.categoryId,
      projectId: itemCat.projectId
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
