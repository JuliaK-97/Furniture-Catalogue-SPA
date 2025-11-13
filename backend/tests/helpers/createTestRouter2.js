import express from 'express';

export default function createTestRouter2(CategoryModel) {
  const router = express.Router();

  router.post('/categories', async (req, res) => {
    try {
      const { categoryName, projectId } = req.body;
      const category = new CategoryModel({ categoryName, project: projectId });
      const saved = await category.save();
      res.status(201).json(saved);
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ error: 'Category name already exists' });
      }
      res.status(400).json({ error: err.message });
    }
  });

  router.patch('/categories/:id', async (req, res) => {
    try {
      const updated = await CategoryModel.findByIdAndUpdate(
        req.params.id,
        { ...req.body, lastUpdated: Date.now() },
        { new: true, runValidators: true }
      );
      if (!updated) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.status(200).json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.delete('/categories/:id', async (req, res) => {
    try {
      const deleted = await CategoryModel.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.status(200).json({ message: 'Category deleted' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router;
}
