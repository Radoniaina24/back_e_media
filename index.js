const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const { globalErrHandler, notFound } = require("./middlewares/globaErrHandler");
const path = require("path");
app.use(cookieParser());
// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000",
  // "https://front-school-managment.vercel.app" || "http://localhost:3000", // Autoriser le frontend à accéder à l'API
  credentials: true, // Permet d'envoyer des cookies
};
app.use(cors(corsOptions));
require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const userRoutes = require("./routes/userRoutes");

const subjectRoutes = require("./routes/subjectRoutes");
const classRoutes = require("./routes/classRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const gradeRoutes = require("./routes/gradeRoutes");
const subjectClassRoutes = require("./routes/subjectClassRoutes");
const authRoutes = require("./routes/authRoutes");
const port = process.env.PORT;
dbConnect();
app.use(express.json());
// ***********//
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
//routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subject", subjectRoutes);
app.use("/api/class", classRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/grade", gradeRoutes);
app.use("/api/subjectClass", subjectClassRoutes);
app.use(
  "/img/students",
  express.static(path.join(__dirname, "public", "img", "students"))
);

//Gestion des erreurs
app.use(notFound);
app.use(globalErrHandler);
