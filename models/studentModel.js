const mongoose = require("mongoose");
// Modèle Étudiant

const FileSchema = new mongoose.Schema({
  url: { type: String, required: true }, // Lien Cloudinary
  publicId: { type: String, required: true }, // ID unique Cloudinary
});

const studentSchema = new mongoose.Schema(
  {
    last_name: { type: String, required: true, trim: true },
    first_name: { type: String, required: true, trim: true },
    date_of_birth: { type: String, required: true },
    current_address: { type: String, required: true, trim: true },

    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    classe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    }, // Relation avec la classe
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    }, // Relation avec la cours
    profilePhoto: { type: FileSchema, require: true },
    last_degree: { type: FileSchema, required: true }, // URL du fichier PDF
    residence_certificate: { type: FileSchema, required: true }, // URL du fichier PDF
    transcript: { type: FileSchema }, // URL du fichier PDF
  },
  { timestamps: true } // Ajoute createdAt & updatedAt automatiquement);
);
const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
