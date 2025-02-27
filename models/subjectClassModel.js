const mongoose = require("mongoose");
const subjectClasseSchema = new mongoose.Schema({
  coefficient: {
    type: Number,
    required: [true, "Ce champ coefficient est requis"],
    min: [1, "La coefficient doit être d'au moins 1."],
    max: [10, "La coefficient ne peut pas dépasser 10."],
  },
  classe: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
});
const SubjectClass = mongoose.model("SubjectClass", subjectClasseSchema);
module.exports = SubjectClass;
