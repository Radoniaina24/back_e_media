const Student = require("../models/studentModel");
const Class = require("../models/classModel");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage, fileFilter: multerFitler });
const uploadStudentPhoto = upload.single("photo");

function multerFitler(req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not image, please upload only image"), false);
  }
}

function resizeStudentPhoto(req, res, next) {
  if (!req.file) return next();
  req.file.filename = `student-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/students/${req.file.filename}`);

  next();
}

async function postStudent(req, res) {
  let photoStudent = "default.png";
  if (req.file) {
    photoStudent = req.file.filename;
  }
  const {
    name,
    first_name,
    gender,
    date_of_birth,
    classe,
    address,
    phone,
    mail,
    mother_name,
    mother_occupation,
    mother_phone,
    father_name,
    father_occupation,
    father_phone,
    submission,
  } = req.body;

  try {
    const classFound = await Class.findOne({ level: classe });
    if (!classFound) {
      throw new Error("La classe n'existe pas");
    }

    const studentExist = await Student.findOne({ first_name });
    if (studentExist) {
      throw new Error("Student already exist");
    }
    //create student
    const student = await new Student({
      photo: photoStudent,
      name,
      first_name,
      gender,
      date_of_birth,
      address,
      phone,
      mail,
      mother_name,
      mother_occupation,
      mother_phone,
      father_name,
      father_occupation,
      father_phone,
      submission,
      classe: classFound._id,
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
  let photoStudent = "";
  if (req.file) {
    photoStudent = req.file.filename;
  }
  const {
    name,
    first_name,
    gender,
    date_of_birth,
    classe,
    address,
    phone,
    mail,
    mother_name,
    mother_occupation,
    mother_phone,
    father_name,
    father_occupation,
    father_phone,
    submission,
  } = req.body;

  const query = { _id: id };
  try {
    const classFound = await Class.findOne({ level: classe });
    if (!classFound) {
      throw new Error("La classe n'existe pas");
    }

    // Récupérer l'étudiant actuel
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Étudiant introuvable" });
    }
    // Si une nouvelle photo est envoyée
    if (req.file) {
      photoStudent = req.file.filename; // Attribuer le nom de la nouvelle photo
      // Supprimer l'ancienne photo si elle n'est pas la photo par défaut
      if (student.photo && student.photo !== "default.png") {
        const oldPhotoPath = path.join(
          __dirname,
          "../public/img/students",
          student.photo
        );
        fs.unlink(oldPhotoPath, (err) => {
          if (err) {
            console.error(
              "Erreur lors de la suppression de l'ancienne photo:",
              err
            );
          }
        });
      }
    } else {
      // Si aucune nouvelle photo n'est envoyée, garder l'ancienne photo
      photoStudent = student.photo;
    }
    await Student.findByIdAndUpdate(
      query,
      {
        photo: photoStudent,
        name,
        first_name,
        gender,
        date_of_birth,
        classe: classFound._id,
        address,
        phone,
        mail,
        mother_name,
        mother_occupation,
        mother_phone,
        father_name,
        father_occupation,
        father_phone,
        submission,
      },
      { new: true, runValidators: true }
    );
  } catch (err) {
    res.status(400).json({ message: err?.message });
  }
  res.status(200).json({ message: "La student est à jour avec success" });
}
async function getStudentById(req, res) {
  const id = req.params.id;
  const student = await Student.findById(id).populate("classe");
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
  uploadStudentPhoto,
  resizeStudentPhoto,
  getStudentById,
};
