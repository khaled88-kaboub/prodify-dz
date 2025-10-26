import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import categorieRoutes from "./routes/categorieRoutes.js";
import produitRoutes from "./routes/produitRoutes.js";
import ligneRoutes from "./routes/ligneRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();


app.use(cors({
  origin: "*", // ou ton frontend sur Netlify
  credentials: true,
}));


app.use(express.json());

// Utilisation des routes
app.use("/api/categories", categorieRoutes);
app.use("/api/produits", produitRoutes);
app.use("/api/lignes", ligneRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));




