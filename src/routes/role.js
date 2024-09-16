const express = require('express');
const router = express.Router();
const Role = require('../models/role');

// 创建角色
router.post('/', async (req, res) => {
    const role = new Role(req.body);
    try {
        await role.save();
        res.status(201).send(role);
    } catch (err) {
        res.status(400).send(err);
    }
});

// 获取所有角色
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find();
        res.send(roles);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
