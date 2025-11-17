import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import projectRoutes from "./routes/projectRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import itemCatRoutes from "./routes/itemCatRoutes.js";
import itemNewRoutes from "./routes/itemNewRoutes.js";
import itemDetailRoutes from "./routes/itemDetailRoutes.js";
import catalogueRoutes from "./routes/catalogueRoutes.js";
import Category from "./models/Category.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/furniture_catalogue";

mongoose
  .connect(uri)
  .then(() => console.log(`MongoDB connected to ${uri}`))
  .catch((err) => console.error("MongoDB error:", err));

app.get("/", (req, res) => {
  res.send("Furniture Catalogue backend is running");
});

const seedCategories = async () => {
  if (process.env.NODE_ENV === "test") return;
  const defaults = ["Castor Chairs", "Desks/Tables", "Soft Seating"];
  for (const name of defaults) {
    const exists = await Category.findOne({ categoryName: name });
    if (!exists) {
      await new Category({ categoryName: name }).save();
    }
  }
};
seedCategories();

app.use("/api", projectRoutes);
app.use("/api", categoryRoutes);
app.use("/api", itemCatRoutes);
app.use("/api", itemNewRoutes);
app.use("/api", itemDetailRoutes);
app.use("/api", catalogueRoutes);

app.use("/uploads", express.static("uploads"));

export default app;

