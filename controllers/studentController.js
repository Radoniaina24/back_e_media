const Student = require("../models/studentModel");
const Class = require("../models/classModel");
const path = require("path");
const Course = require("../models/courseModel");
const fs = require("fs").promises;

async function postStudent(req, res) {
  if (!req.files) {
    return res
      .status(400)
      .json({ message: "Veuillez télécharger les fichiers requis." });
  }

  const uploadedFiles = {};
  Object.keys(req.files).forEach((key) => {
    uploadedFiles[key] = {
      url: req.files[key][0].path,
      publicId: req.files[key][0].filename,
      type: req.files[key][0].mimetype.startsWith("image/") ? "image" : "pdf",
    };
  });
  const {
    last_name,
    first_name,
    date_of_birth,
    current_address,
    email,
    phone_number,
    classe,
    course,
  } = req.body;

  try {
    const classFound = await Class.findOne({ level: classe });
    if (!classFound) {
      throw new Error("The class does not exist.");
    }
    const courseFound = await Course.findOne({ level: course });
    if (!courseFound) {
      throw new Error("The course does not exist");
    }

    const studentExist = await Student.findOne({ email });
    if (studentExist) {
      throw new Error("Student already exist");
    }
    //create student
    const student = await new Student({
      last_name,
      first_name,
      date_of_birth,
      current_address,
      email,
      phone_number,
      classe: classFound._id,
      course: courseFound._id,
      //fichier image et pdf
      profilePhoto: uploadedFiles.profilePhoto,
      last_degree: uploadedFiles.last_degree,
      residence_certificate: uploadedFiles.residence_certificate,
      transcript: uploadedFiles.transcript,
    });
    await student.save();
    res.status(201).json({
      message: "Student registered Successfully",
      data: student,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}
async function deleteStudent(req, res) {
  const id = req.params.id;
  try {
    // Récupérer l'étudiant à partir de MongoDB par ID
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }
    // Construire le chemin complet de l'image
    const imagePath = path.join(
      __dirname,
      "../public/img/students",
      student.photo
    );
    // Supprimer l'image du dossier si elle existe
    if (student.photo !== "default.png") {
      try {
        await fs.unlink(imagePath); // Supprime l'image seulement si ce n'est pas "default.png"
      } catch (err) {
        if (err.code !== "ENOENT") throw err; // Ignore l'erreur si le fichier n'existe pas
      }
    }
    // Supprimer l'étudiant de la base de données
    await Student.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Étudiant et image supprimés avec succès" });
  } catch (error) {
    // Si le fichier n'existe pas, ignorez l'erreur et continuez la suppression de l'étudiant
    if (error.code === "ENOENT") {
      await Student.findByIdAndDelete(req.params.id);
      return res
        .status(200)
        .json({ message: "Étudiant supprimé, mais l'image n'existait pas" });
    }
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'étudiant" });
  }
}
async function getAllStudent(req, res) {
  // n'oublie pas de mettre des filtre par date
  const { page = 1, limit = 10, search } = req.query;
  try {
    const searchQuery = {};
    if (search) {
      searchQuery.$or = [
        { first_name: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }
    const allStudents = await Student.countDocuments();
    const tolaleStudents = await Student.countDocuments(searchQuery);
    const totalPages = Math.ceil(tolaleStudents / limit);
    const students = await Student.find(searchQuery)
      .populate("course")
      .populate("classe")
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      status: "success",
      message: "Student fetched successfully",
      totale: tolaleStudents,
      totalPages,
      students,
      allStudents,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
async function updateStudent(req, res) {
  const id = req.params.id;
  if (!req.files) {
    return res
      .status(400)
      .json({ message: "Veuillez télécharger les fichiers requis." });
  }
  const uploadedFiles = {};
  Object.keys(req.files).forEach((key) => {
    uploadedFiles[key] = {
      url: req.files[key][0].path,
      publicId: req.files[key][0].filename,
      type: req.files[key][0].mimetype.startsWith("image/") ? "image" : "pdf",
    };
  });

  const {
    last_name,
    first_name,
    date_of_birth,
    current_address,
    email,
    phone_number,
    classe,
    course,
  } = req.body;
  console.log(last_name);
  const query = { _id: id };
  console.log(id);
  try {
    const classFound = await Class.findOne({ level: classe });
    if (!classFound) {
      throw new Error("The class does not exist.");
    }
    const courseFound = await Course.findOne({ level: course });
    if (!courseFound) {
      throw new Error("The course does not exist");
    }

    // Récupérer l'étudiant actuel
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student already exist" });
    }

    await Student.findByIdAndUpdate(
      query,
      {
        last_name,
        first_name,
        date_of_birth,
        current_address,
        email,
        phone_number,
        classe: classFound._id,
        course: courseFound._id,
        //fichier image et pdf
        profilePhoto: uploadedFiles.profilePhoto,
        last_degree: uploadedFiles.last_degree,
        residence_certificate: uploadedFiles.residence_certificate,
        transcript: uploadedFiles.transcript,
      },
      { new: true, runValidators: true }
    );
  } catch (err) {
    res.status(400).json({ message: err?.message });
  }
  res.status(200).json({ message: " student  update successfully" });
}
async function getStudentById(req, res) {
  const id = req.params.id;
  const student = await Student.findById(id)
    .populate("classe")
    .populate("course");
  if (!student) throw new Error("Student not found");
  res.json({
    status: "success",
    message: "Student fetched successfully",
    student,
  });
}
module.exports = {
  postStudent,
  deleteStudent,
  getAllStudent,
  updateStudent,
  getStudentById,
};
