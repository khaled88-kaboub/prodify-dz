import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getProduits, createProduit, updateProduit, deleteProduit } from "../controllers/produitController.js";

const router = express.Router();

router.route("/")
  .get(protect, getProduits)
  .post(protect, createProduit);

router.route("/:id")
  .put(protect, updateProduit)
  .delete(protect, deleteProduit);

export default router;
