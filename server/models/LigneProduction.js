// models/LigneProduction.js
import mongoose from "mongoose";

const ligneSchema = new mongoose.Schema({
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

export default mongoose.model("LigneProduction", ligneSchema);
