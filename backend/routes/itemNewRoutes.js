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

