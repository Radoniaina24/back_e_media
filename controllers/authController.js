const User = require("../models/userModel");
const verifyToken = require("../utils/verifyToken");
const bcrypt = require("bcrypt");
const {
  generateToken,
  generateRefreshToken,
} = require("../utils/generateToken");

// Inscription
async function registerUser(req, res) {
  const { username, email, password, role } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new Error("User already exist");
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    //create user
    const user = await new User({
      username,
      email,
      password: hashPassword,
      role,
    });
    await user.save();
    // OR
    // const user = await User.create({name, email})
    res.status(201).json({
      message: "User registered Successfully",
      data: user,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  const userFound = await User.findOne({ email });

  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    const token = generateToken(userFound?._id);
    const refreshToken = generateRefreshToken(userFound?._id);
    userFound.refreshToken = refreshToken;
    userFound.save();
    // Ajouter le token dans un cookie HttpOnly
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Le cookie ne peut pas être accédé via JavaScript
      secure: process.env.NODE_ENV === "production", // Utiliser HTTPS en production
      sameSite: "Strict", // Pour éviter l'envoi du cookie dans des contextes cross-site
      maxAge: 3600000, // 1 heure
    });

    res.json({
      status: "success",
      message: "User logged in successfully",
      token,
    });
  } else {
    throw new Error("Invalid login credentials");
  }
}

async function getMe(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Utilisateur non authentifié." });
  }
  const user = req.user; // Injecté par le middleware `isLoggedIn`
  res.status(200).json({
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}

async function logout(req, res) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Utiliser HTTPS en production
    sameSite: "Strict", // Pour éviter le CSRF
  });
  res.json({ message: "User logged out successfully" });
}

async function refreshAccessToken(req, res) {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ message: "Non autorisé." });

  try {
    const payload = verifyToken(refreshToken);
    if (!payload) return res.status(401).json({ message: "Non autorisé." });

    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken)
      return res.status(403).json({ message: "Accès interdit." });

    const newAccessToken = generateToken(user._id);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
}

module.exports = {
  getMe,
  registerUser,
  login,
  logout,
  refreshAccessToken,
};
