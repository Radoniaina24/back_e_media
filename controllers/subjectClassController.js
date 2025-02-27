const Class = require("../models/classModel");
const Subject = require("../models/subjectModel");
const SubjectClass = require("../models/subjectClassModel");
async function postSubjectClass(req, res) {
  const { subject, classe, coefficient } = req.body;
  try {
    // Vérifiez si la classe et la matière existent
    const classeFound = await Class.findOne({ level: classe });
    const subjectFound = await Subject.findOne({ name: subject });
    if (!classeFound || !subjectFound)
      return res.status(404).json({ message: "Class or Subject not found." });

    const subjectClass = new SubjectClass({
      classe: classeFound._id,
      subject: subjectFound._id,
      coefficient,
    });
    await subjectClass.save();

    // Mise à jour de la classe pour inclure cette association
    classeFound.subjects.push(subjectClass._id);
    await classeFound.save();

    res.status(201).json({
      message: "SubjectClass registered Successfully",
      data: subjectClass,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}
async function deleteSubjectClass(req, res) {}
async function getAllSubjectClass(req, res) {}
async function updateSubjectClass(req, res) {}
module.exports = {
  postSubjectClass,
  deleteSubjectClass,
  getAllSubjectClass,
  updateSubjectClass,
};
