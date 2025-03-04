const asyncHandler = require("express-async-handler");
const express = require("express");
const userRoutes = express.Router();
const userContollers = require("../controllers/userControllers");
const isLoggedIn = require("../middlewares/isLoggedIn");
const checkRole = require("../utils/checkRole");

userRoutes.get("/", asyncHandler(userContollers.getAllUser));
userRoutes.get("/:uid", userContollers.getOneUser);
userRoutes.post(
  "/register",
  isLoggedIn,
  checkRole(["admin"]),
  asyncHandler(userContollers.postUser)
);
userRoutes.put(
  "/update/:uid",
  isLoggedIn,
  checkRole(["admin"]),
  asyncHandler(userContollers.updateUser)
);
userRoutes.delete(
  "/delete/:uid",
  isLoggedIn,
  checkRole(["admin"]),
  userContollers.deleteUser
);
module.exports = userRoutes;
