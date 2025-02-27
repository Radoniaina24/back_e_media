const mongoose = require("mongoose");
// Modèle Étudiant
const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstname: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  classe: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }], // Classes attribuées
  subject: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }], // Matières enseignées
});
const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
