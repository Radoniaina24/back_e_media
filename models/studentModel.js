const mongoose = require("mongoose");
// Modèle Étudiant
const studentSchema = new mongoose.Schema({
  photo: { type: String },
  name: { type: String, required: true },
  first_name: { type: String, required: true },
  gender: { type: String, required: true },
  date_of_birth: { type: String, required: true },
  classe: { type: mongoose.Schema.Types.ObjectId, ref: "Class" }, // Relation avec la classe
  address: { type: String, required: true },
  phone: { type: String },
  mail: { type: String },
  school_level: { type: String },
  mother_name: { type: String, required: true },
  mother_occupation: { type: String, required: true },
  mother_phone: { type: String, required: true },
  father_name: { type: String, required: true },
  father_occupation: { type: String, required: true },
  father_phone: { type: String, required: true },
  submission: { type: String, required: true },
});
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
