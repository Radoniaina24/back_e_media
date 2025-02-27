const asyncHandler = require("express-async-handler");
const express = require("express");
const teacherRoutes = express.Router();
const teacherContollers = require("../controllers/teacherController");
teacherRoutes.get("/", asyncHandler(teacherContollers.getAllTeacher));
teacherRoutes.post("/register", asyncHandler(teacherContollers.postTeacher));
teacherRoutes.put("/update/:id", asyncHandler(teacherContollers.updateTeacher));
teacherRoutes.delete(
  "/delete/:id",
  asyncHandler(teacherContollers.deleteTeacher)
);

module.exports = teacherRoutes;
