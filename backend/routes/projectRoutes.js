/**
 * Project Routes
 * handles all backend operations related to the dashboard and project management
 * includes endpoints for CRUD operations for the projects
 * integrates category and item counts for enriched dashboard views
 */
import express from "express";
import Project from "../models/Project.js";
import Category from "../models/Category.js";
import ItemNew from "../models/ItemNew.js";

const router = express.Router();
/**
 * @route POST /projects
 * @description
 * Creates a new Project document using the data provided in the request body.
 * The request body should contain all required fields defined in the Project model.
 * On success, the newly created project/catalogue is saved to the database and returned in the response with a 201 Created status code.
 * If validation fails or the document cannot be saved, a 400 Bad Request response is returned along with an error message describing the issue.
 * @returns {Object} 201 - The newly created project object.
 * @returns {Object} 400 - An error object containing validation or save failure details.
 */

router.post("/projects", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/**
 * @route GET /projects
 * @description
 * Retrieves all Project documents from the database, sorted by creation date
 * in descending order. For each project, additional computed fields are included:
 *  - `categoryCount`: The total number of Category documents (global count).
 *  - `itemCount`: The number of ItemNew documents associated with the project
 *    (matched by `projectId`).
 * The response is an array of enriched project objects combining the original
 * project data with these computed counts.
 * @returns {Object[]} 200 - A list of enriched project objects.
 * @returns {Object} 500 - An error object if an unexpected server error occurs.
 */

router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    const enriched = await Promise.all(
      projects.map(async (p) => {
        const categoryCount = await Category.countDocuments(); // global count
        const itemCount = await ItemNew.countDocuments({ projectId: p._id });
        return { ...p.toObject(), categoryCount, itemCount };
      })
    );
    res.status(200).json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/**
 * @route PATCH /projects/:id/status
 * @description
 * Updates the `status` field of a specific Project document. Also updates
 * the `lastUpdated` timestamp. Validation is enforced through Mongoose.
 * If the updated status is `"closed"`, all ItemNew documents associated with the project (matched by `projectId`) are deleted automatically.
 * @param {String} req.params.id - The ID of the project to update.
 * @param {String} req.body.status - The new status value for the project.
 * @returns {Object} 200 - The updated project object.
 * @returns {Object} 404 - Error when the project is not found.
 * @returns {Object} 400 - Validation or update error details.
 */
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

    if (status === "closed") {
      await ItemNew.deleteMany({ projectId: req.params.id });
    }

    res.status(200).json(updatedProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/**
 * @route GET /projects/:id
 * @description
 * Retrieves a single Project document by its unique ID.
 * @param {String} req.params.id - The ID of the project to retrieve.
 * @returns {Object} 200 - The requested project object.
 * @returns {Object} 404 - Error if the project does not exist.
 * @returns {Object} 400 - Error if the ID is invalid or another query error occurs.
 */
router.get("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/**
 * @route DELETE /projects/:id
 * @description
 * Deletes a Project document by its ID. After deleting the project, all
 * associated Category and ItemNew documents (linked via `projectId`) are also removed to ensure data cleanup and referential integrity.
 * @param {String} req.params.id - The ID of the project to delete.
 * @returns {Object} 200 - Success message indicating the project was deleted.
 * @returns {Object} 404 - Error if the project does not exist.
 * @returns {Object} 400 - Error if deletion fails or the ID is invalid.
 */
router.delete("/projects/:id", async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ error: "Project not found" });
    }
    await Category.deleteMany({ projectId: req.params.id });
    await ItemNew.deleteMany({ projectId: req.params.id });

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


export default router;

