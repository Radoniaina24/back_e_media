const User = require("../models/userModel");
const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

async function isLoggedIn(req, res, next) {
  //recuperation du token
  const token = getTokenFromHeader(req);
  try {
    // Décodage et vérification du token
    const decoded = verifyToken(token);
    // Récupérer l'utilisateur correspondant et exclure le mot de passe
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    req.user = user; // Injecter les données utilisateur dans la requête
    next();
  } catch (error) {
    return res.status(500).json({ message: "Accès non autorisé" });
  }
}
module.exports = isLoggedIn;
