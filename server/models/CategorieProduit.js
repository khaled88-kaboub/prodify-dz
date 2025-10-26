// models/CategorieProduit.js
import mongoose from "mongoose";

const categorieSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model("CategorieProduit", categorieSchema);
