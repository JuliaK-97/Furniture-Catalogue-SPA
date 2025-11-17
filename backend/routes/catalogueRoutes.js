import express from "express";
import Catalogue from "../models/Catalogue.js";
import ItemNew from "../models/ItemNew.js";
import ItemDetail from "../models/ItemDetail.js";

const router = express.Router();

router.post("/catalogues", async (req, res) => {
  try {
    const newCatalogue = new Catalogue(req.body);
    await newCatalogue.save();
    res.status(201).json(newCatalogue);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/catalogues", async (req, res) => {
  try {
    const all = await Catalogue.find().sort({ createdAt: -1 });
    res.status(200).json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/catalogues/:id", async (req, res) => {
  try {
    const found = await Catalogue.findById(req.params.id);
    if (!found) return res.status(404).json({ error: "Catalogue not found" });
    res.status(200).json(found);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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


