// db.js
const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.USER}:${process.env.USERPASSWORD}@myesp32project.p6esf.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority&appName=MyEsp32Project`,
      {}
    );
    console.log("MongoDB connected...");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
