const Teacher = require("../models/teacherModel");
async function postTeacher(req, res) {
  const { name, firstname, address, phone, email, classe, subject } = req.body;
  try {
    const teacherExist = await Teacher.findOne({ firstname });
    if (teacherExist) {
      throw new Error("Teacher already exist");
    }
    //create teacher
    const teacher = await new Teacher({
      name,
      firstname,
      address,
      phone,
      email,
      classe,
      subject,
    });
    await teacher.save();
    res.status(201).json({
      message: "Teacher registered Successfully",
      data: teacher,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}
async function deleteTeacher(req, res) {
  const id = req.params.id;
  try {
    await Teacher.deleteOne({ _id: id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ message: "Teacher delete Successfully" });
}
async function getAllTeacher(req, res) {
  // n'oublie pas de mettre des filtre par date
  const { page = 1, limit = 10, search } = req.query;
  try {
    const searchQuery = {};
    if (search) {
      searchQuery.$or = [
        { firstname: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }
    const tolaleTeachers = await Teacher.countDocuments(searchQuery);
    const teachers = await Teacher.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      status: "success",
      message: "Teacher fetched successfully",
      totale: tolaleTeachers,
      teachers,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
async function updateTeacher(req, res) {
  const id = req.params.id;
  const { name, firstname, address, phone, email, classe, subject } = req.body;

  const query = { _id: id };
  try {
    await Teacher.findByIdAndUpdate(
      query,
      {
        name,
        firstname,
        address,
        phone,
        email,
        classe,
        subject,
      },
      { new: true, runValidators: true }
    );
  } catch (err) {
    res.status(400).json({ message: err?.message });
  }
  res.status(200).json({ message: "La professeur est à jour avec success" });
}
module.exports = {
  postTeacher,
  deleteTeacher,
  getAllTeacher,
  updateTeacher,
};
