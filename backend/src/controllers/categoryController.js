import { Category } from "../models/Category.js";

export async function getAllCategories(req, res) {
  try {
    const categories = await Category.findAll({ order: [["name", "ASC"]] });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Greška pri učitavanju kategorija.", error: String(err) });
  }
}

export async function createCategory(req, res) {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Naziv kategorije je obavezan." });

    const created = await Category.create({ name });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: "Greška pri kreiranju kategorije.", error: String(err) });
  }
}

export async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: "Kategorija nije pronađena." });

    category.name = name ?? category.name;
    await category.save();

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Greška pri izmjeni kategorije.", error: String(err) });
  }
}

export async function deleteCategory(req, res) {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: "Kategorija nije pronađena." });

    await category.destroy();
    res.json({ message: "Kategorija obrisana." });
  } catch (err) {
    res.status(500).json({ message: "Greška pri brisanju kategorije.", error: String(err) });
  }
}
