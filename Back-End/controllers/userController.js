// controllers/userController.js
const User = require("../models/User");
const Log = require("../models/Log");

exports.getLogById = async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.params.id }); // Sử dụng route param
    if (!logs) {
      return res.status(404).json({ message: "log not found" });
    }
    res.json(logs.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const Logs = await Log.find();
    res.status(201).json(Logs.reverse());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email, password: password });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Sử dụng route param
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const Users = await User.find({ role: "user" });
    res.status(201).json(Users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Khi quet the vao
exports.getPerInUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Sử dụng route param
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.state == "out") {
      res.json({ allow: "true" });
    } else {
      res.json({ allow: "false" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.handlePerInUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Sử dụng route param

    const client = req.clientIDs[user._id];
    const admin = req.AdminclientIDs;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.state == "out") {
      user.state = "in";
      user.totalAmount += 3;
      await user.save();
      const log = await Log.create({ userId: user._id });
      if (client) {
        client.emit("userUpdated", user);
        client.emit("logUpdated", log);
      }
      if (admin) {
        console.log(admin);
        Object.values(admin).forEach((el) => {
          el.emit("logUpdated", log);
          el.emit("userUpdated", user);
        });
      }
      res.json({ allow: "true" });
    } else {
      res.json({ allow: "false" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Khi quet the ra
exports.getPerOutUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Sử dụng route param

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.state == "out") {
      res.json({ allow: "false" });
    } else {
      res.json({ allow: "true" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Khi quet the ra
exports.handlePerOutUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Sử dụng route param
    const client = req.clientIDs[user._id];
    const admin = req.AdminclientIDs;
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.state == "out") {
      res.json({ allow: "false" });
    } else {
      user.state = "out";
      await user.save();
      const [log] = await Log.find({ userId: user._id, timeOut: null });
      log.timeOut = Date.now();
      await log.save();
      if (client) {
        client.emit("userUpdated", user);
        client.emit("logUpdated", log);
      }
      if (admin) {
        Object.values(admin).forEach((el) => {
          el.emit("logUpdated", log);
          el.emit("userUpdated", user);
        });
      }

      res.json({ allow: "true" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Tao user
exports.createUser = async (req, res) => {
  const { id, name, email, role, password } = req.body;

  try {
    const newUser = await User.create({
      _id: id,
      name: name,
      role: role,
      email: email,
      password: password,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//Tao user
exports.updateUser = async (req, res) => {
  const { name, state, totalAmount } = req.body;

  try {
    const userId = req.params.id; // lấy ID từ URL
    const user = await User.findById(userId);
    user.name = name;
    user.state = state;
    user.totalAmount = totalAmount;
    user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // lấy ID từ URL
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
