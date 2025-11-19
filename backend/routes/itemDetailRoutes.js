/**
 * ItemDetail Routes
 * Handles backend operations for managing detailed information of individual items.
 * Includes retrieval and update of item details, with automatic lot number assignment.
 */
import express from "express";
import ItemDetail from "../models/ItemDetail.js";

const router = express.Router();
/**
 * @route GET /item-details/:itemId
 * @description
 * Retrieves the detailed information for a specific item using its unique itemId.
 * @param {string} req.params.itemId - The ID of the item to fetch details for.
 * @returns {Object} 200 - The item detail record.
 * @returns {Object} 404 - Detail not found for the given itemId.
 * @returns {Object} 400 - Invalid request or server error.
 */
router.get("/item-details/:itemId", async (req, res) => {
  try {
    const detail = await ItemDetail.findOne({ itemId: req.params.itemId });
    if (!detail) return res.status(404).json({ error: "Detail not found" });
    res.status(200).json(detail);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/**
 * @route PUT /item-details/:itemId
 * @description
 * Updates an existing item detail or creates a new one if it does not exist (upsert).
 * Automatically assigns a lot number in the format `LOT-{n}` based on the number of existing items in the same project, and sets the lastUpdated timestamp.
 * @param {string} req.params.itemId - The ID of the item to update or create details for.
 * @param {Object} req.body - Fields to update, including projectId, condition, location, etc.
 * @param {string} req.body.projectId - The project ID used to determine the next lot number.
 * @returns {Object} 200 - The newly created or updated item detail record.
 * @returns {Object} 400 - Validation or update error.
 */
router.put("/item-details/:itemId", async (req, res) => {
  try {
    const { projectId } = req.body;
    const existing = await ItemDetail.find({ projectId });
    const nextLot = `LOT-${existing.length + 1}`;

    const updated = await ItemDetail.findOneAndUpdate(
      { itemId: req.params.itemId },
      {
        ...req.body,
        lotNumber: nextLot,
        lastUpdated: Date.now()
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;