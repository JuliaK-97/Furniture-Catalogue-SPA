import express from "express";
import ItemCat from "../models/ItemCat.js";
import ItemNew from "../models/ItemNew.js";

const router = express.Router();

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

router.delete("/itemCats/:id", async (req, res) => {
  try {
    const deleted = await ItemCat.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Catalogue item entry not found" });
    res.status(200).json({ message: "Catalogue item entry deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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
