/**
 * Category Routes
 * Handles backend operations related to category management, including:
 * - Creating new categories
 * - Retrieving all or specific categories
 * - Updating category information
 * - Deleting categories
 * Features:
 * - Ensures unique category names (returns 409 on duplicate)
 * - Maintains lastUpdated timestamp on updates
 */
import express from "express";
import Category from "../models/Category.js";

const router = express.Router();
/**
 * @route POST /categories
 * @description
 * Creates a new category with a unique name.
 * @param {string} req.body.categoryName - The name of the new category.
 * @returns {Object} 201 - The newly created category object.
 * @returns {Object} 409 - Error if category name already exists.
 * @returns {Object} 400 - Validation or save error.
 */
router.post("/categories", async (req, res) => {
  try {
    const { categoryName } = req.body;
    const category = new Category({ categoryName });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Category name already exists" });
    }
    res.status(400).json({ error: err.message });
  }
});
/**
 * @route GET /categories
 * @description
 * Retrieves all categories, sorted by newest first.
 * @returns {Object[]} 200 - Array of category objects.
 * @returns {Object} 500 - Server error.
 */

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/**
 * @route GET /categories/:id
 * @description
 * Retrieves a single category by its unique ID.
 * @param {string} req.params.id - The category ID.
 * @returns {Object} 200 - The requested category object.
 * @returns {Object} 404 - Error if category not found.
 * @returns {Object} 400 - Error if ID is invalid.
 */

router.get("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/**
 * @route PATCH /categories/:id
 * @description
 * Updates an existing category with the provided fields in the request body.
 * Automatically sets the `lastUpdated` timestamp.
 * @param {string} req.params.id - The ID of the category to update.
 * @param {Object} req.body - Fields to update (e.g., categoryName).
 * @returns {Object} 200 - The updated category object.
 * @returns {Object} 404 - Error if category not found.
 * @returns {Object} 400 - Validation or update error.
 */

router.patch("/categories/:id", async (req, res) => {
  try {
    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "Category not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/**
 * @route DELETE /categories/:id
 * @description
 * Deletes a category by its unique ID.
 * @param {string} req.params.id - The ID of the category to delete.
 * @returns {Object} 200 - Confirmation message.
 * @returns {Object} 404 - Error if category not found.
 * @returns {Object} 400 - Deletion or validation error.
 */

router.delete("/categories/:id", async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Category not found" });
    res.status(200).json({ message: "Category deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;



