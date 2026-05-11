import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getReports, createReport, updateReport, deleteReport, getDailyProduction } from "../controllers/reportController.js";

const router = express.Router();

router.route("/:id")
  .put(protect, updateReport)
  .delete(protect, deleteReport);

router.get("/daily", protect, getDailyProduction);
router.route("/")
  .get(protect, getReports)
  .post(protect, createReport);


 

export default router;
