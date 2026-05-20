import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  getReports, 
  createReport, 
  updateReport, 
  deleteReport, 
  getDailyProduction,
  getMonthlyStats, // On importe la nouvelle fonction
  getMonthlyGroupStats
} from "../controllers/reportController.js";

const router = express.Router();

// 1. Routes fixes (Toujours en haut)
router.get("/daily", protect, getDailyProduction);
router.get("/stats-mensuelles", protect, getMonthlyStats); // 📊 Nouvelle route
router.get("/stats-groupe-mensuel", protect, getMonthlyGroupStats);

// 2. Routes de base sur "/"
router.route("/")
  .get(protect, getReports)
  .post(protect, createReport);

// 3. Routes avec paramètres dynamiques (Toujours en bas)
router.route("/:id")
  .put(protect, updateReport)
  .delete(protect, deleteReport);

export default router;
