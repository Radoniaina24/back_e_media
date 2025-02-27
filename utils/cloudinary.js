const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuration de Multer avec stockage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "student_e_media", // Dossier dans Cloudinary
    format: async (req, file) => "png", // Format d'image (peut être jpg, webp, etc.)
    public_id: (req, file) => {
      file.originalname.split(".")[0];
    }, // Garde le même nom de fichier (sans extension)
  },
});

const upload = multer({ storage });
const uploadStudentPhoto = upload.single("photo");

module.exports = uploadStudentPhoto;
