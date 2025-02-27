const asyncHandler = require("express-async-handler");
const express = require("express");
const studentRoutes = express.Router();
const studentContollers = require("../controllers/studentController");
const uploadStudentPhoto = require("../utils/cloudinary");

studentRoutes.get("/", asyncHandler(studentContollers.getAllStudent));
studentRoutes.get("/:id", asyncHandler(studentContollers.getStudentById));
studentRoutes.post(
  "/register",
  uploadStudentPhoto,
  asyncHandler(studentContollers.postStudent)
);
studentRoutes.put("/update/:id", asyncHandler(studentContollers.updateStudent));
studentRoutes.delete(
  "/delete/:id",
  asyncHandler(studentContollers.deleteStudent)
);
module.exports = studentRoutes;
