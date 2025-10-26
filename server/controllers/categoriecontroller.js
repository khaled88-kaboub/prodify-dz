import CategorieProduit from "../models/CategorieProduit.js";

export const getCategories = async (req, res) => {
  const categories = await CategorieProduit.find();
  res.json(categories);
};

export const createCategorie = async (req, res) => {
  const categorie = await CategorieProduit.create(req.body);
  res.status(201).json(categorie);
};

export const updateCategorie = async (req, res) => {
  const categorie = await CategorieProduit.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(categorie);
};

export const deleteCategorie = async (req, res) => {
  await CategorieProduit.findByIdAndDelete(req.params.id);
  res.json({ message: "Catégorie supprimée" });
};
