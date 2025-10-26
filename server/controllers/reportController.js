import Report from "../models/Report.js";

export const getReports = async (req, res) => {
  const reports = await Report.find()
    .populate("categorieProduit produit ligneProduction user")
    .sort ({date: 1});
  res.json(reports);
};

export const createReport = async (req, res) => {
  const data = { ...req.body, user: req.user.id };
  const report = await Report.create(data);
  res.status(201).json(report);
};

export const updateReport = async (req, res) => {
  const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(report);
};

export const deleteReport = async (req, res) => {
  await Report.findByIdAndDelete(req.params.id);
  res.json({ message: "Rapport supprimé" });
};
