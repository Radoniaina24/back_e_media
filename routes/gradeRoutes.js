const asyncHandler = require("express-async-handler");
const express = require("express");
const gradeRoutes = express.Router();
const gradeContollers = require("../controllers/gradeController");
gradeRoutes.get("/", asyncHandler(gradeContollers.getAllGrade));
gradeRoutes.post("/register", asyncHandler(gradeContollers.postGrade));
gradeRoutes.put("/update/:id", asyncHandler(gradeContollers.updateGrade));
gradeRoutes.delete("/delete/:id", asyncHandler(gradeContollers.deleteGrade));

module.exports = gradeRoutes;
