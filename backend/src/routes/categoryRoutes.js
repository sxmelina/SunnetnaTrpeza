import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

export const categoryRoutes = Router();

categoryRoutes.get("/", getAllCategories);
categoryRoutes.post("/", requireAuth, createCategory);
categoryRoutes.put("/:id", requireAuth, updateCategory);
categoryRoutes.delete("/:id", requireAuth, deleteCategory);
