const asyncHandler = require("express-async-handler");
const express = require("express");
const studentRoutes = express.Router();
const studentContollers = require("../controllers/studentController");

studentRoutes.get("/", asyncHandler(studentContollers.getAllStudent));
studentRoutes.get("/:id", asyncHandler(studentContollers.getStudentById));
studentRoutes.post(
  "/register",
  studentContollers.uploadStudentPhoto,
  studentContollers.resizeStudentPhoto,
  asyncHandler(studentContollers.postStudent)
);
studentRoutes.put(
  "/update/:id",
  studentContollers.uploadStudentPhoto,
  studentContollers.resizeStudentPhoto,
  asyncHandler(studentContollers.updateStudent)
);
studentRoutes.delete(
  "/delete/:id",
  asyncHandler(studentContollers.deleteStudent)
);

module.exports = studentRoutes;
