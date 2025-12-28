import { User } from "./User.js";
import { Category } from "./Category.js";
import { Recipe } from "./Recipe.js";

// Relacija: jedna kategorija ima više recepata
Category.hasMany(Recipe, {
  foreignKey: { name: "categoryId", allowNull: false },
  onDelete: "RESTRICT"
});

Recipe.belongsTo(Category, {
  foreignKey: { name: "categoryId", allowNull: false }
});

// Izvoz svih modela
export const models = { User, Category, Recipe };
