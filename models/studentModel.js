const mongoose = require("mongoose");
// Modèle Étudiant
const studentSchema = new mongoose.Schema(
  {
    profilePhoto: { type: String, require: true },
    last_name: { type: String, required: true, trim: true },
    first_name: { type: String, required: true, trim: true },
    date_of_birth: { type: String, required: true },
    current_address: { type: String, required: true, trim: true },
    last_degree: { type: String, required: true }, // URL du fichier PDF
    residence_certificate: { type: String, required: true }, // URL du fichier PDF
    transcript: { type: String }, // URL du fichier PDF
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
  },
  { timestamps: true } // Ajoute createdAt & updatedAt automatiquement);
);
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
