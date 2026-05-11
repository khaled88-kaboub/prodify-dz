import Report from "../models/Report.js";

export const getReports = async (req, res) => {
  const reports = await Report.find()
    .populate("categorieProduit produit ligneProduction user")
    .sort ({date: 1});
  res.json(reports);
};

//export const createReport = async (req, res) => {
 // const data = { ...req.body, user: req.user.id };
  //const report = await Report.create(data);
 // res.status(201).json(report);
//};

export const createReport = async (req, res) => {
  try {
    const newReport = await Report.create({
      ...req.body,
      user: req.user._id, // ✅ l'utilisateur connecté
    });
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du rapport" });
  }
};


//export const updateReport = async (req, res) => {
  //const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
  //res.json(report);
//};

//export const deleteReport = async (req, res) => {
  //await Report.findByIdAndDelete(req.params.id);
  //res.json({ message: "Rapport supprimé" });
//};



// 🛠️ Modifier un rapport
export const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) return res.status(404).json({ message: "Rapport introuvable" });

    // ⚠️ Vérification des permissions
    if (req.user.role !== "admin" && report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès refusé : action non autorisée" });
    }

    report.title = req.body.title || report.title;
    report.content = req.body.content || report.content;
    await report.save();

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du rapport" });
  }
};

// ❌ Supprimer un rapport
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Rapport introuvable" });

    // ⚠️ Vérification des permissions
    if (req.user.role !== "admin" && report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Accès refusé : action non autorisée" });
    }

    await report.deleteOne();
    res.json({ message: "Rapport supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du rapport" });
  }
};

//import Report from "../models/Report.js";
import Produit from "../models/Produit.js";

export const getDailyProduction = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const results = await Report.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: "$produit",
          totalCartons: { $sum: "$nombreCartons" }
        }
      },
      {
        $lookup: {
          from: "produits",
          localField: "_id",
          foreignField: "_id",
          as: "produit"
        }
      },
      {
        $unwind: "$produit"
      },
      {
        $project: {
          _id: 0,
          produitNom: "$produit.nom",
          totalCartons: 1
        }
      }
    ]);

    res.json(results);
  } catch (err) {
    console.error("Erreur daily report :", err);
    res.status(500).json({ message: "Erreur lors du calcul de la production du jour" });
  }
};


