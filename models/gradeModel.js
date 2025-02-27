const mongoose = require("mongoose");
// Modèle Note
const gradeSchema = new mongoose.Schema({
  valeur: Number,
  date: { type: String, required: true },
  type: {
    type: String,
    enum: ["DS1", "DS2", "DS3", "E1", "E2", "E3"],
    required: true,
  },
  // Note  DS pour l'éxamen 1 trimestre, // Note  pour l'éxamen 1 trimestre,
  // Note  DS pour l'éxamen 2 trimestre, // Note  pour l'éxamen 2 trimestre,
  // Note  DS pour l'éxamen 3 trimestre, // Note  pour l'éxamen 3 trimestre,
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
});
const Grade = mongoose.model("Grade", gradeSchema);
module.exports = Grade;
