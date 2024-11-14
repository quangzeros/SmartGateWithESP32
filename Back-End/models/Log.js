const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose); // Thư viện tự động tăng

// Tạo schema cho bảng logs
const logSchema = new mongoose.Schema(
  {
    _id: Number, // ID tự động tăng
    userId: {
      type: String,
      required: true,
    },
    timeIn: {
      type: Date,
      required: true,
      default: Date.now, // Mặc định là thời điểm hiện tại
    },
    timeOut: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false, // Bỏ qua id mặc định của mongoose vì sẽ dùng autoIncrement
    timestamps: false, // Tự động thêm createdAt và updatedAt
  }
);

// Kích hoạt auto-increment cho _id
logSchema.plugin(AutoIncrement, { id: "log_counter", inc_field: "_id" });

module.exports = mongoose.model("Log", logSchema);
