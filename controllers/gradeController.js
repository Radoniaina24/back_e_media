const Grade = require("../models/gradeModel");
async function postGrade(req, res) {
  const { valeur, date, type } = req.body;
  try {
    //create grade
    const grade = await new Grade({
      valeur,
      date,
      type,
    });
    await grade.save();
    res.status(201).json({
      message: "Grade registered Successfully",
      data: grade,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}
async function deleteGrade(req, res) {
  const id = req.params.id;
  try {
    await Grade.deleteOne({ _id: id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ message: "Grade delete Successfully" });
}
async function getAllGrade(req, res) {
  try {
    const grades = await Grade.find();
    const totale = await Grade.countDocuments();
    res.status(200).json({
      status: "success",
      message: "Grades fetched successfully",
      totale,
      grades,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
async function updateGrade(req, res) {
  const id = req.params.id;
  const { valeur, date, type } = req.body;

  const query = { _id: id };
  try {
    await Grade.findByIdAndUpdate(
      query,
      { valeur, date, type },
      { new: true, runValidators: true }
    );
  } catch (err) {
    res.status(400).json({ message: err?.message });
  }
  res.status(200).json({ message: "La note est à jour avec success" });
}
module.exports = {
  postGrade,
  deleteGrade,
  getAllGrade,
  updateGrade,
};
