import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // 🔍 Décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🧑‍💼 Trouver l'utilisateur sans le mot de passe
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Token invalide ou expiré" });
    }
  } else {
    res.status(401).json({ message: "Non autorisé, aucun token fourni" });
  }
};

