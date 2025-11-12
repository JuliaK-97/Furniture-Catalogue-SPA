import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import projectRoutes from "./routes/projectRoutes.js";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));


app.get("/", (req, res) => {
  res.send("Furniture Catalogue backend is running");
});

app.use("/api", projectRoutes);
app.use("/api", categoryRoutes);
export default app;
