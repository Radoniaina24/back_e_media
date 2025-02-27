const mongoose = require("mongoose");
// Modèle Classe
const courseSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ["CAN", "MPJ", "TIC", "DRT", "MGT"],
    required: true,
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
});
const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
