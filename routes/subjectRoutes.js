const asyncHandler = require("express-async-handler");
const express = require("express");
const subjectRoutes = express.Router();
const subjectContollers = require("../controllers/subjectController");
subjectRoutes.get("/", asyncHandler(subjectContollers.getAllSubject));
subjectRoutes.post("/register", asyncHandler(subjectContollers.postSubject));
subjectRoutes.put("/update/:id", asyncHandler(subjectContollers.updateSubject));
subjectRoutes.delete(
  "/delete/:id",
  asyncHandler(subjectContollers.deleteSubject)
);

module.exports = subjectRoutes;
