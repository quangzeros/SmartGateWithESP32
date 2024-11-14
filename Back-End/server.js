const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./utils/db");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const server = require("http").createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép tất cả nguồn
    methods: ["GET", "POST"],
  },
});
const userRoutes = require("./routes/userRoutes");

let clients = {};
let Adminclients = {};

//Ket noi vs DB
connectDB();

// Cho phép tất cả các yêu cầu CORS
app.use(cors());

//Middleware
app.use(express.json()); // Để parse JSON bodies
app.use((req, res, next) => {
  req.clientIDs = clients;
  req.AdminclientIDs = Adminclients;
  next();
});

//Routes
app.use("/", userRoutes);

// Socket.IO - Khi có kết nối từ client
io.on("connection", (socket) => {
  console.log("Client connected", socket.id);

  // Khi nhận được thông báo từ client (chứa id user)
  socket.on("registerUser", (data) => {
    const { id } = data;
    if (data.role == "admin") {
      const { adminId } = data;
      Adminclients[adminId] = socket;
    }
    clients[id] = socket; // Lưu socket của user theo id
    console.log("Registered user with ID:", id);
  });

  // Xử lý khi client đóng kết nối
  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
