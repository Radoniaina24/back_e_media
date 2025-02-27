const asyncHandler = require("express-async-handler");
const express = require("express");
const userRoutes = express.Router();
const userContollers = require("../controllers/userControllers");
const isLoggedIn = require("../middlewares/isLoggedIn");

userRoutes.get("/", asyncHandler(userContollers.getAllUser));
userRoutes.get("/:uid", userContollers.getOneUser);
userRoutes.post("/register", asyncHandler(userContollers.postUser));
userRoutes.put(
  "/update/:uid",
  isLoggedIn,
  asyncHandler(userContollers.updateUser)
);
userRoutes.delete("/delete/:uid", isLoggedIn, userContollers.deleteUser);
module.exports = userRoutes;
