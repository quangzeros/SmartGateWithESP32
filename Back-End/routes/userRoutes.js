// routes/userRoutes.js
const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  getPerInUserById,
  getPerOutUserById,
  handleLogin,
  handlePerInUserById,
  handlePerOutUserById,
  deleteUser,
  updateUser,
  getLogs,
  getLogById,
} = require("../controllers/userController");
const router = express.Router();

router.post("/users", createUser);

router.get("/users", getUsers);

router.get("/users/:id", getUserById);

router.get("/logs", getLogs);

router.get("/logs/:id", getLogById);

router.get("/usersPerIn/:id", getPerInUserById);

router.get("/handleUsersPerIn/:id", handlePerInUserById);

router.get("/usersPerOut/:id", getPerOutUserById);

router.get("/handleUsersPerOut/:id", handlePerOutUserById);

router.post("/users/login", handleLogin);

router.post("/users/:id", updateUser);

router.delete("/users/:id", deleteUser);
module.exports = router;
