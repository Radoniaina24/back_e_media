const asyncHandler = require("express-async-handler");
const express = require("express");
const subjectClassRoutes = express.Router();
const subjectClassContollers = require("../controllers/subjectClassController");
subjectClassRoutes.get(
  "/",
  asyncHandler(subjectClassContollers.getAllSubjectClass)
);
subjectClassRoutes.post(
  "/register",
  asyncHandler(subjectClassContollers.postSubjectClass)
);
subjectClassRoutes.put(
  "/update/:id",
  asyncHandler(subjectClassContollers.updateSubjectClass)
);
subjectClassRoutes.delete(
  "/delete/:id",
  asyncHandler(subjectClassContollers.deleteSubjectClass)
);

module.exports = subjectClassRoutes;
