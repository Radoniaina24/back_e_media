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
      res.status(404);
      throw new Error("Utilisateur non trouvé");
    }

    req.user = user; // Injecter les données utilisateur dans la requête
    next();
  } catch (error) {
    throw new Error("Invalid or expired token, please logged in again");
  }
}
module.exports = isLoggedIn;
