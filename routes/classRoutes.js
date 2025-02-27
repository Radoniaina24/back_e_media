const asyncHandler = require("express-async-handler");
const express = require("express");
const classRoutes = express.Router();
const classContollers = require("../controllers/classController");
classRoutes.get("/", asyncHandler(classContollers.getAllClass));
classRoutes.post("/register", asyncHandler(classContollers.postClass));
classRoutes.put("/update/:id", asyncHandler(classContollers.updateClass));
classRoutes.delete("/delete/:id", asyncHandler(classContollers.deleteClass));

module.exports = classRoutes;
