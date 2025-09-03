// app.js
// Server Express cho mô phỏng web phát hiện phishing (port 4000)

const path = require("path");
const express = require("express");
const router = require("./routes/index");

const app = express();

// Đọc JSON body
app.use(express.json());

// Phục vụ static từ thư mục /public
app.use(express.static(path.join(__dirname, "public")));

// Mount toàn bộ route
app.use("/", router);

// Khởi động
app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
