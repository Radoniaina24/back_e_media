const Subject = require("../models/subjectModel");
async function postSubject(req, res) {
  const { name, coefficient } = req.body;
  try {
    const subjectExist = await Subject.findOne({ name });
    if (subjectExist) {
      throw new Error("Subject already exist");
    }
    //create subject
    const subject = await new Subject({
      name,
      coefficient,
    });
    await subject.save();
    // OR
    // const subject = await User.create({name, email})
    res.status(201).json({
      message: "Subject registered Successfully",
      data: subject,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}
async function deleteSubject(req, res) {
  const id = req.params.id;
  try {
    await Subject.deleteOne({ _id: id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ message: "Subject delete Successfully" });
}
async function getAllSubject(req, res) {
  try {
    const subjects = await Subject.find();
    const totale = await Subject.countDocuments();
    res.status(200).json({
      status: "success",
      message: "Subjects fetched successfully",
      totale,
      subjects,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
async function updateSubject(req, res) {
  const id = req.params.id;
  const { name, coefficient } = req.body;

  const query = { _id: id };
  try {
    await Subject.findByIdAndUpdate(
      query,
      { name, coefficient },
      { new: true, runValidators: true }
    );
  } catch (err) {
    res.status(400).json({ message: err?.message });
  }
  res.status(200).json({ message: "La matière est à jour avec success" });
}
module.exports = {
  postSubject,
  deleteSubject,
  getAllSubject,
  updateSubject,
};
