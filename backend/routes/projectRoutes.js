import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

router.post("/projects", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }); 
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.patch("/projects/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { status, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get("/projects/:id", async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({error:"Project doesn't exist or can't be found"});
        }
        res.status(200).json(project);
    }catch (err) {
    res.status(400).json({ error: err.message });
    }
});


export default router;
