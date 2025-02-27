const Course = require("../models/courseModel");
async function postCourse(req, res) {
  const { level } = req.body;
  try {
    const courseExist = await Course.findOne({ level });
    if (courseExist) {
      throw new Error("Course already exist");
    }
    //create course
    const course = await new Course({
      level,
    });
    await course.save();
    res.status(201).json({
      message: "Course registered Successfully",
      data: course,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}
async function deleteCourse(req, res) {
  const id = req.params.id;
  try {
    await Course.deleteOne({ _id: id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ message: "Course delete Successfully" });
}
async function getAllCourse(req, res) {
  try {
    const courses = await Course.find();
    const totale = await Course.countDocuments();
    res.status(200).json({
      status: "success",
      message: "Course fetched successfully",
      totale,
      courses,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
async function updateCourse(req, res) {
  const id = req.params.id;
  const { level } = req.body;

  const query = { _id: id };
  try {
    await Course.findByIdAndUpdate(
      query,
      { level },
      { new: true, runValidators: true }
    );
  } catch (err) {
    res.status(400).json({ message: err?.message });
  }
  res.status(200).json({ message: "La course est à jour avec success" });
}
module.exports = {
  postCourse,
  deleteCourse,
  getAllCourse,
  updateCourse,
};
