// models/Produit.js
import mongoose from "mongoose";

const produitSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    trim: true
  },
  categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CategorieProduit",
    required: true
  },
  unite: {
    type: String,
    default: "kg"
  }
}, { timestamps: true });

export default mongoose.model("Produit", produitSchema);
