import express from 'express';

export default function createTestRouter3(ItemModel) {
  const router = express.Router();

  router.post('/items', async (req, res) => {
    try {
      const { name, image, categoryId, projectId } = req.body;
      const item = new ItemModel({ name, image, categoryId, projectId });
      const saved = await item.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  router.patch('/items/:id', async (req, res) => {
    try {
      const updated = await ItemModel.findByIdAndUpdate(
        req.params.id,
        { ...req.body, lastUpdated: Date.now() },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.status(200).json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
   router.delete('/items/:id', async (req, res) => {
    try {
      const deleted = await ItemModel.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Item not found' });
      }
      res.status(200).json({ message: 'Item deleted' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}