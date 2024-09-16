const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher');

// 创建教师
router.post('/', async (req, res) => {
    const teacher = new Teacher(req.body);
    try {
        await teacher.save();
        res.status(201).send(teacher);
    } catch (err) {
        res.status(400).send(err);
    }
});

// 获取所有教师
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.find().populate('courses');
        res.send(teachers);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
