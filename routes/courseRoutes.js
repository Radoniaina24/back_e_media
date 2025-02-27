const asyncHandler = require("express-async-handler");
const express = require("express");
const courseRoutes = express.Router();
const courseContollers = require("../controllers/courseController");
courseRoutes.get("/", asyncHandler(courseContollers.getAllCourse));
courseRoutes.post("/register", asyncHandler(courseContollers.postCourse));
courseRoutes.put("/update/:id", asyncHandler(courseContollers.updateCourse));
courseRoutes.delete("/delete/:id", asyncHandler(courseContollers.deleteCourse));

module.exports = courseRoutes;
