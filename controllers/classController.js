const Class = require("../models/classModel");
async function postClass(req, res) {
  const { level, subject } = req.body;
  try {
    const classeExist = await Class.findOne({ level });
    if (classeExist) {
      throw new Error("Class already exist");
    }
    //create classe
    const classe = await new Class({
      level,
      subject,
    });
    await classe.save();
    res.status(201).json({
      message: "Class registered Successfully",
      data: classe,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}
async function deleteClass(req, res) {
  const id = req.params.id;
  try {
    await Class.deleteOne({ _id: id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ message: "Class delete Successfully" });
}
async function getAllClass(req, res) {
  try {
    const classes = await Class.find();
    const totale = await Class.countDocuments();
    res.status(200).json({
      status: "success",
      message: "Class fetched successfully",
      totale,
      classes,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
async function updateClass(req, res) {
  const id = req.params.id;
  const { level, subject } = req.body;

  const query = { _id: id };
  try {
    await Class.findByIdAndUpdate(
      query,
      { level, subject },
      { new: true, runValidators: true }
    );
  } catch (err) {
    res.status(400).json({ message: err?.message });
  }
  res.status(200).json({ message: "La classe est à jour avec success" });
}
module.exports = {
  postClass,
  deleteClass,
  getAllClass,
  updateClass,
};
