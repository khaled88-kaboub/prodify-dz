import Produit from "../models/Produit.js";

export const getProduits = async (req, res) => {
  const produits = await Produit.find().populate("categorie");
  res.json(produits);
};

export const createProduit = async (req, res) => {
  const produit = await Produit.create(req.body);
  res.status(201).json(produit);
};

export const updateProduit = async (req, res) => {
  const produit = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(produit);
};

export const deleteProduit = async (req, res) => {
  await Produit.findByIdAndDelete(req.params.id);
  res.json({ message: "Produit supprimé" });
};
