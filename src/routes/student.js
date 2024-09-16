const express = require("express");
const router = express.Router();
const Student = require("../models/student");

// 创建学生
router.post("/", async (req, res) => {
  const student = new Student(req.body);
  try {
    await student.save();
    res.status(201).send(student);
  } catch (err) {
    res.status(400).send(err);
  }
});

// 获取所有学生
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // 当前页码
    const pageSize = parseInt(req.query.pageSize) || 5; // 每页显示的数量
    const skip = (page - 1) * pageSize; // 跳过的记录数

    // 获取总学生数，用于前端显示分页
    const totalStudents = await Student.countDocuments();

    // 获取分页的学生数据
    const students = await Student.find().skip(skip).limit(pageSize);

    res.json({
      students,
      total: totalStudents, // 返回总学生数
      page,
      pageSize,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// 更新学生
router.put("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(student);
  } catch (err) {
    res.status(400).send(err);
  }
});

// 删除学生
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
