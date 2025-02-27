const mongoose = require("mongoose");
// Modèle Classe
const classSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ["L1", "L2", "L3"],
    require: true,
  },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
});
const Class = mongoose.model("Class", classSchema);
module.exports = Class;
