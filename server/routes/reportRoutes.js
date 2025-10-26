import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getReports, createReport, updateReport, deleteReport } from "../controllers/reportController.js";

const router = express.Router();

router.route("/")
  .get(protect, getReports)
  .post(protect, createReport);

router.route("/:id")
  .put(protect, updateReport)
  .delete(protect, deleteReport);

export default router;
