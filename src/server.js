const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const studentRoutes = require("./routes/student");
const courseRoutes = require("./routes/course");
const teacherRoutes = require("./routes/teacher");
const roleRoutes = require("./routes/role");

const app = express();

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 路由
app.use("/students", studentRoutes);
app.use("/courses", courseRoutes);
app.use("/teachers", teacherRoutes);
app.use("/roles", roleRoutes);

// 连接 MongoDB
mongoose
  .connect("mongodb://localhost:27017/school", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
