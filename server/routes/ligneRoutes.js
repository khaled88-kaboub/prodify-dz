import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getLignes, createLigne, updateLigne, deleteLigne } from "../controllers/ligneController.js";

const router = express.Router();

router.route("/")
  .get(protect, getLignes)
  .post(protect, createLigne);

router.route("/:id")
  .put(protect, updateLigne)
  .delete(protect, deleteLigne);

export default router;
