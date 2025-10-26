import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getCategories, createCategorie, updateCategorie, deleteCategorie } from "../controllers/categorieController.js";

const router = express.Router();

router.route("/")
  .get(protect, getCategories)
  .post(protect, createCategorie);

router.route("/:id")
  .put(protect, updateCategorie)
  .delete(protect, deleteCategorie);

export default router;
