import express from 'express';

export default function createTestRouter5(ItemDetailModel) {
  const router = express.Router();

  router.get('/item-details/:itemId', async (req, res) => {
    try {
      const detail = await ItemDetailModel.findOne({ itemId: req.params.itemId });
      if (!detail) return res.status(404).json({ error: 'Detail not found' });
      res.status(200).json(detail);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.put('/item-details/:itemId', async (req, res) => {
    try {
      const { projectId } = req.body;
      const existing = await ItemDetailModel.find({ projectId });
      const nextLot = `LOT-${existing.length + 1}`;

      const updated = await ItemDetailModel.findOneAndUpdate(
        { itemId: req.params.itemId },
        { ...req.body, lotNumber: nextLot, lastUpdated: Date.now() },
        { upsert: true, new: true, runValidators: true }
      );

      res.status(200).json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}
