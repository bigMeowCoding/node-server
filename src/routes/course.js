const express = require('express');
const router = express.Router();
const Course = require('../models/course');

// 创建课程
router.post('/', async (req, res) => {
    const course = new Course(req.body);
    try {
        await course.save();
        res.status(201).send(course);
    } catch (err) {
        res.status(400).send(err);
    }
});

// 获取所有课程
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('teacher').populate('students');
        res.send(courses);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
