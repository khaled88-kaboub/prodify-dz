// models/Report.js
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  date: { type: Date, required: true, default: Date.now },
  groupe: { type: String, enum: ["A", "B", "C" , "D"], required: true },
  shift: { type: String, enum: ["06:00-14:00", "14:00-22:00", "22:00-06:00"], required: true },

  // 🔗 Références
  categorieProduit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CategorieProduit",
    required: true
  },
  produit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produit",
    required: true
  },
  ligneProduction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LigneProduction",
    required: true
  },

  nombreCartons: { type: Number, required: true, min: 0 },
  dechetsKg: { type: Number, required: true, min: 0 },
  remarques: { type: String, trim: true },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

export default mongoose.model("Report", reportSchema);
