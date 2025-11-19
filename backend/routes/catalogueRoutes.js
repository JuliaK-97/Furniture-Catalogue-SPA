/**
 * Catalogue Routes
 * Handles backend operations related to catalogues, including:
 * - Creating catalogue records
 * - Retrieving all or specific catalogues
 * - Generating merged catalogue views using item + item details
 * - Deleting catalogue-related data
 * Integrates data from:
 *  - Catalogue model (stored catalogue definitions)
 *  - ItemNew model (item records associated with projects)
 *  - ItemDetail model (extra metadata such as lot number, condition, etc.)
 */
import express from "express";
import Catalogue from "../models/Catalogue.js";
import ItemNew from "../models/ItemNew.js";
import ItemDetail from "../models/ItemDetail.js";

const router = express.Router();
/**
 * @route POST /catalogues
 * @description
 * Creates a new Catalogue record using data provided in the request body.
 * @param {Object} req.body - Catalogue fields defined in the Catalogue model.
 * @returns {Object} 201 - Newly created catalogue.
 * @returns {Object} 400 - Validation or save error.
 */

router.post("/catalogues", async (req, res) => {
  try {
    const newCatalogue = new Catalogue(req.body);
    await newCatalogue.save();
    res.status(201).json(newCatalogue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/**
 * @route GET /catalogues
 * @description
 * Retrieves all catalogue entries, sorted by newest first.
 * @returns {Object[]} 200 - Array of catalogue objects.
 * @returns {Object} 500 - Server error.
 */
router.get("/catalogues", async (req, res) => {
  try {
    const all = await Catalogue.find().sort({ createdAt: -1 });
    res.status(200).json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/**
 * @route GET /catalogues/:id
 * @description
 * Retrieves a single catalogue by its unique ID.
 * @param {string} req.params.id - The catalogue ID.
 * @returns {Object} 200 - The requested catalogue.
 * @returns {Object} 404 - Error if not found.
 * @returns {Object} 400 - Error if ID is invalid.
 */

router.get("/catalogues/:id", async (req, res) => {
  try {
    const found = await Catalogue.findById(req.params.id);
    if (!found) return res.status(404).json({ error: "Catalogue not found" });
    res.status(200).json(found);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/**
 * @route GET /catalogue/:projectId
 * @description
 * Generates a merged catalogue view for a specific project.
 * Process:
 *  1. Retrieves items belonging to the given project.
 *  2. Retrieves ItemDetail records for those items.
 *  3. Combines item + detail data into a single response object.
 * Returned fields include:
 *  - name
 *  - categoryName
 *  - lotNumber
 *  - condition
 *  - location
 * @param {string} req.params.projectId - The project ID whose catalogue is requested.
 * @returns {Object[]} 200 - Array of merged catalogue entries.
 * @returns {Object} 500 - Server error.
 */

router.get("/catalogue/:projectId", async (req, res) => {
  try {
    const items = await ItemNew.find({ projectId: req.params.projectId })
      .populate("categoryId", "categoryName")
      .lean();

    const details = await ItemDetail.find({
      itemId: { $in: items.map(i => i._id) }
    }).lean();

    const merged = items.map(item => {
      const detail = details.find(d => d.itemId.toString() === item._id.toString());
      return {
        _id: item._id,
        name: item.name,
        categoryName: item.categoryId?.categoryName || "Unknown",
        lotNumber: detail?.lotNumber || "Not assigned",
        condition: detail?.condition || "Unknown",
        location: detail?.location || {}

      };
    });

    res.status(200).json(merged);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/**
 * @route DELETE /catalogue/:itemId
 * @description
 * Deletes both the ItemDetail record and the ItemNew record associated with the given item ID. This ensures catalogue data remains consistent.
 * @param {string} req.params.itemId - The ID of the item to delete.
 * @returns {Object} 200 - Confirmation message.
 * @returns {Object} 400 - Error if deletion fails or ID is invalid.
 */
router.delete("/catalogue/:itemId", async (req, res) => {
  try {
    await ItemDetail.findOneAndDelete({ itemId: req.params.itemId });
    await ItemNew.findByIdAndDelete(req.params.itemId);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


export default router;


