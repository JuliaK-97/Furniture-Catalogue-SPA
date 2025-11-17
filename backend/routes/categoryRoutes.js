import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

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

router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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



