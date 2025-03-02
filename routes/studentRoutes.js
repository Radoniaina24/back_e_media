const asyncHandler = require("express-async-handler");
const express = require("express");
const studentRoutes = express.Router();
const studentContollers = require("../controllers/studentController");
const { uploadFileStudent } = require("../utils/cloudinary");

studentRoutes.get("/", asyncHandler(studentContollers.getAllStudent));
studentRoutes.get("/:id", asyncHandler(studentContollers.getStudentById));
studentRoutes.post(
  "/register",
  uploadFileStudent,
  asyncHandler(studentContollers.postStudent)
);
studentRoutes.put("/update/:id", asyncHandler(studentContollers.updateStudent));
studentRoutes.delete(
  "/delete/:id",
  asyncHandler(studentContollers.deleteStudent)
);
module.exports = studentRoutes;
