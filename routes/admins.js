const {Admin, validateAdmin, validateEmail, validatePassword, passwordHashing} = require('../models/admin');
const express = require('express');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const admins = await Admin.find();
        res.send(admins);
    } catch (error) {
        console.error('Error fetching admins' + error);
        return res.status(400).send(error.details[0].message);
    }
})

router.post('/', async (req, res) => {
    const { error } = validateAdmin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let admin = new Admin({
        username: req.body.username,
        email: req.body.email,
        password: await passwordHashing(req.body.password)
    })

    try {
        admin = await admin.save();
        res.send(admin);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.username) {
            return res.status(400).send('Username is already taken');
        } else if (error.code === 11000 && error.keyPattern.email) {
            return res.status(400).send('Email is already taken');
        } else {
            console.error('Error creating admin:', error);
            return res.status(500).send('Internal Server Error');
        }
    }
})

router.put('/:id', [auth], async (req, res) => {
    const { error } = validateAdmin(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let admin;
    try {
        admin = await Admin.findByIdAndUpdate(
            req.params.id,
            {
                username: req.body.username,
                email: req.body.email,
                password: await passwordHashing(req.body.password)
            },
            { new: true }
        );
    } catch (error) {
        return res.status(404).send('Admin not found');
    }
    res.send(admin);
});

router.patch('/change-email/:id', [auth], async (req, res) => {
    const { error } = validateEmail(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    let admin;
    try {
        admin = await Admin.findByIdAndUpdate(
            req.params.id, { email: req.body.email },
            { new: true }
        );
    } catch (err) {
        return res.status(404).send('Admin not found');
    }
    res.send(admin);
})

router.patch('/change-psw/:id', [auth], async (req, res) => {
    const { error } = validatePassword(req.body)
    if (error) return res.status(400).send(error.details[0].message);
    try {
        admin = await Admin.findByIdAndUpdate(
            req.params.id, { password: await passwordHashing(req.body.password) },
            { new: true }
        );
    } catch (err) {
        return res.status(404).send('Admin not found');
    }
    res.send(admin);
})

router.get('/forgot-email/:username', async (req, res) => {
    try {
        const admin = await Admin.findOne({ username: req.params.username });
        if (!admin) {
            return res.status(400).send("Admin not found");
        }
        res.send(admin.email);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.delete('/delete/:id', [auth], async (req, res) => {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).send('Admin with given id was not found.');
    res.send(admin);
})

module.exports = router;