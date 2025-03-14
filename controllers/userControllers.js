const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");

async function getAllUser(req, res) {
  // n'oublie pas de mettre des filtre par date
  const { page = 1, limit = 10, search } = req.query;
  try {
    const searchQuery = {};
    if (search) {
      searchQuery.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const allUsers = await User.countDocuments();
    const tolaleUsers = await User.countDocuments(searchQuery);
    const totalPages = Math.ceil(tolaleUsers / limit);
    const users = await User.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      totale: tolaleUsers,
      totalPages,
      users,
      allUsers,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
async function getOneUser(req, res) {
  const uid = req.params.uid;
  let user;
  try {
    user = await User.find({ _id: uid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ user });
}
async function updateUser(req, res) {
  const uid = req.params.uid;
  const { username, email, password, role } = req.body;
  const query = { _id: uid };
  try {
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    await User.findOneAndUpdate(query, {
      username,
      email,
      password: hashPassword,
      role,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ message: "User is up to date with success" });
}
async function deleteUser(req, res) {
  const uid = req.params.uid;
  try {
    await User.deleteOne({ _id: uid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
  res.status(200).json({ message: "success" });
}
async function postUser(req, res) {
  const { username, email, password, role } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new Error("User already exist");
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    //create user
    const user = await new User({
      username,
      email,
      password: hashPassword,
      role,
    });
    await user.save();
    // OR
    // const user = await User.create({name, email})
    res.status(201).json({
      message: "User registered Successfully",
      data: user,
    });
  } catch (err) {
    throw new Error(err.message);
  }
}
module.exports = {
  getAllUser,
  postUser,
  getOneUser,
  deleteUser,
  updateUser,
};
