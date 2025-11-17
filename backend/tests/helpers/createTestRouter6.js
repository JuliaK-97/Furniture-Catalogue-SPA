import express from 'express';

export default function createTestRouter6(CatalogueModel) {
  const router = express.Router();

  router.post('/catalogues', async (req, res) => {
    try {
      const catalogue = new CatalogueModel(req.body);
      const saved = await catalogue.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/catalogue/:projectId', async (req, res) => {
    try {
      const items = await CatalogueModel.find({ projectId: req.params.projectId });
      const details = await CatalogueModel.findDetails(items.map(i => i._id));

      const merged = items.map(item => {
        const detail = details.find(d => d.itemId === item._id);
        return {
          _id: item._id,
          name: item.name,
          categoryName: item.categoryId?.categoryName || 'Unknown',
          lotNumber: detail?.lotNumber || 'Not assigned',
          condition: detail?.condition || 'Unknown',
          location: detail?.location || {},
        };
      });

      res.status(200).json(merged);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/catalogue/:itemId', async (req, res) => {
    try {
      await CatalogueModel.findOneAndDelete({ itemId: req.params.itemId });
      const deleted = await CatalogueModel.findByIdAndDelete(req.params.itemId);
      if (!deleted) return res.status(404).json({ error: 'Item not found' });
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}
