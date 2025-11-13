import express from 'express';

export default function createTestRouter(ProjectModel) {
  const router = express.Router();

  router.post('/projects', async (req, res) => {
    try {
      const project = new ProjectModel(req.body);
      const saved = await project.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.patch('/projects/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      const updatedProject = await ProjectModel.findByIdAndUpdate(
        req.params.id,
        { status, lastUpdated: Date.now() },
        { new: true, runValidators: true }
      );

      if (!updatedProject) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.status(200).json(updatedProject);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  return router; 
}
