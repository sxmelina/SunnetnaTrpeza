import { Recipe } from "../models/Recipe.js";
import { Category } from "../models/Category.js";

export async function getAllRecipes(req, res) {
  try {
    const recipes = await Recipe.findAll({
      include: [{ model: Category }],
      order: [["createdAt", "DESC"]]
    });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Greška pri učitavanju recepata.", error: String(err) });
  }
}

export async function getRecipeById(req, res) {
  try {
    const recipe = await Recipe.findByPk(req.params.id, { include: [{ model: Category }] });
    if (!recipe) return res.status(404).json({ message: "Recept nije pronađen." });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Greška pri učitavanju recepta.", error: String(err) });
  }
}

export async function createRecipe(req, res) {
  try {
    const { title, instructions, categoryId, shortDescription, sourceType, sourceReference, imageUrl } = req.body;

    if (!title || !instructions || !categoryId) {
      return res.status(400).json({ message: "Naslov, upute i categoryId su obavezni." });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) return res.status(400).json({ message: "Neispravan categoryId (kategorija ne postoji)." });

    const created = await Recipe.create({
      title,
      instructions,
      categoryId,
      shortDescription: shortDescription ?? null,
      sourceType: sourceType ?? "ZDRAVO",
      sourceReference: sourceReference ?? null,
      imageUrl: imageUrl ?? null
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: "Greška pri kreiranju recepta.", error: String(err) });
  }
}

export async function updateRecipe(req, res) {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recept nije pronađen." });

    const {
      title, instructions, categoryId,
      shortDescription, sourceType, sourceReference, imageUrl
    } = req.body;

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) return res.status(400).json({ message: "Neispravan categoryId (kategorija ne postoji)." });
      recipe.categoryId = categoryId;
    }

    recipe.title = title ?? recipe.title;
    recipe.instructions = instructions ?? recipe.instructions;
    recipe.shortDescription = shortDescription ?? recipe.shortDescription;
    recipe.sourceType = sourceType ?? recipe.sourceType;
    recipe.sourceReference = sourceReference ?? recipe.sourceReference;
    recipe.imageUrl = imageUrl ?? recipe.imageUrl;

    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Greška pri izmjeni recepta.", error: String(err) });
  }
}

export async function deleteRecipe(req, res) {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recept nije pronađen." });

    await recipe.destroy();
    res.json({ message: "Recept obrisan." });
  } catch (err) {
    res.status(500).json({ message: "Greška pri brisanju recepta.", error: String(err) });
  }
}
