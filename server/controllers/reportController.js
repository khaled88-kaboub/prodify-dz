import Report from "../models/Report.js";
import Produit from "../models/Produit.js";

// 🟢 Récupérer tous les rapports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("categorieProduit produit ligneProduction user")
      .sort({ date: 1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des rapports" });
  }
};

// 🟢 Créer un rapport
export const createReport = async (req, res) => {
  try {
    const newReport = await Report.create({
      ...req.body,
      user: req.user._id, // ✅ Utilisateur connecté via le middleware protect
    });
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du rapport" });
  }
};

// 🟡 Modifier un rapport
export const updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
};

// 🔴 Supprimer un rapport
export const deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: "Rapport supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression" });
  }
};

// 📊 Statistiques de production du jour (Déjà existant)
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
          from: "produits", // Nom de la collection en BD (souvent en minuscule + pluriel)
          localField: "_id",
          foreignField: "_id",
          as: "produit"
        }
      },
      { $unwind: "$produit" },
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

// 📊 NOUVEAU : Statistiques mensuelles (Tableau croisé dynamique)
export const getMonthlyStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const stats = await Report.aggregate([
      {
        // On ne filtre que l'année en cours pour ne pas mélanger les données des années passées
        $match: {
          date: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
          }
        }
      },
      {
        $project: {
          produit: "$produit",
          nombreCartons: "$nombreCartons",
          month: { $month: "$date" } // Extrait le mois (1 pour Janvier, 12 pour Décembre)
        }
      },
      {
        $group: {
          _id: { produit: "$produit", month: "$month" },
          totalCartons: { $sum: "$nombreCartons" }
        }
      },
      {
        $lookup: {
          from: "produits",
          localField: "_id.produit",
          foreignField: "_id",
          as: "produitInfo"
        }
      },
      { $unwind: "$produitInfo" },
      {
        $project: {
          _id: 0,
          produitNom: "$produitInfo.nom",
          month: "$_id.month",
          totalCartons: 1
        }
      }
    ]);

    // On transforme le résultat brut en format matrice : { "Produit A": { 1: 100, 2: 0, ... } }
    const matrix = {};
    stats.forEach((item) => {
      if (!matrix[item.produitNom]) {
        matrix[item.produitNom] = { produit: item.produitNom };
        // On initialise par défaut les 12 mois à 0
        for (let i = 1; i <= 12; i++) {
          matrix[item.produitNom][i] = 0;
        }
      }
      matrix[item.produitNom][item.month] = item.totalCartons;
    });

    res.json(Object.values(matrix));
  } catch (err) {
    console.error("Erreur stats mensuelles :", err);
    res.status(500).json({ message: "Erreur lors du calcul des statistiques mensuelles" });
  }
};

// 📊 Détails mensuels : Regroupement par Produit et par Groupe pour un mois donné
export const getMonthlyGroupStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const month = parseInt(req.query.month);

    if (!month || month < 1 || month > 12) {
      return res.status(400).json({ message: "Mois invalide. Spécifiez un mois entre 1 et 12." });
    }

    const startDate = new Date(currentYear, month - 1, 1);
    const endDate = new Date(currentYear, month, 0, 23, 59, 59, 999);

    const stats = await Report.aggregate([
      {
        // 1. Filtrer par mois et année en cours
        $match: {
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        // 2. Grouper par produit ET par groupe (équipe)
        $group: {
          _id: { produit: "$produit", groupe: "$groupe" },
          totalCartons: { $sum: "$nombreCartons" },
          totalDechets: { $sum: "$dechetsKg" }
        }
      },
      {
        $lookup: {
          from: "produits",
          localField: "_id.produit",
          foreignField: "_id",
          as: "produitInfo"
        }
      },
      { $unwind: "$produitInfo" },
      {
        $project: {
          _id: 0,
          produitNom: "$produitInfo.nom",
          groupe: "$_id.groupe",
          totalCartons: 1,
          totalDechets: 1
        }
      }
    ]);

    // 3. Matrice avec vos 4 groupes : BOUFASSA, MOUHAMMOU, FEDALA, D
    const matrix = {};
    stats.forEach(item => {
      if (!matrix[item.produitNom]) {
        matrix[item.produitNom] = {
          produit: item.produitNom,
          "BOUFASSA": { cartons: 0, dechets: 0 },
          "MOUHAMMOU": { cartons: 0, dechets: 0 },
          "FEDALA": { cartons: 0, dechets: 0 },
          "D": { cartons: 0, dechets: 0 }
        };
      }
      if (matrix[item.produitNom][item.groupe]) {
        matrix[item.produitNom][item.groupe] = {
          cartons: item.totalCartons,
          dechets: item.totalDechets
        };
      }
    });

    res.json(Object.values(matrix));
  } catch (err) {
    console.error("Erreur stats groupe mensuel :", err);
    res.status(500).json({ message: "Erreur lors du calcul des statistiques par groupe" });
  }
};