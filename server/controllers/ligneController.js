import LigneProduction from "../models/LigneProduction.js";

export const getLignes = async (req, res) => {
  const lignes = await LigneProduction.find();
  res.json(lignes);
};

export const createLigne = async (req, res) => {
  const ligne = await LigneProduction.create(req.body);
  res.status(201).json(ligne);
};

export const updateLigne = async (req, res) => {
  const ligne = await LigneProduction.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ligne);
};

export const deleteLigne = async (req, res) => {
  await LigneProduction.findByIdAndDelete(req.params.id);
  res.json({ message: "Ligne supprimée" });
};
