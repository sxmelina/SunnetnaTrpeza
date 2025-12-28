import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
} from "../controllers/recipeController.js";

export const recipeRoutes = Router();

recipeRoutes.get("/", getAllRecipes);
recipeRoutes.get("/:id", getRecipeById);
recipeRoutes.post("/", requireAuth, createRecipe);
recipeRoutes.put("/:id", requireAuth, updateRecipe);
recipeRoutes.delete("/:id", requireAuth, deleteRecipe);
