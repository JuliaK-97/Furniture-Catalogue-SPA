import express from "express";
import ItemCat from "../models/ItemCat.js";

const router = express.Router();
router.post("/items", async (req, res) => {
  try {
    const { name, image, categoryId, projectId } = req.body;
    const item = new ItemCat({
      name,
      image,
      categoryId,
      projectId
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/items", async (req, res) => {
  try {
    const { projectId, categoryId } = req.query;
    const query = {};
    if (projectId) query.projectId = projectId;
    if (categoryId) query.categoryId = categoryId;

    const items = await ItemCat.find(query)
      .populate("projectId")
      .populate("categoryId")
      .sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.patch("/items/:id", async (req, res) => {
  try {
    const updatedItem = await ItemCat.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: Date.now() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/items/:id", async (req, res) => {
  try {
    const item = await ItemCat.findById(req.params.id)
      .populate("projectId")
      .populate("categoryId");

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/items/:id", async (req, res) => {
  try {
    const deleted = await ItemCat.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;