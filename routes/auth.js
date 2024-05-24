const Joi = require('joi')
const bcrypt = require('bcrypt')
const {Admin, passwordHashing} = require('../models/admin')
const mongoose = require('mongoose')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const config = require('config')

const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
    const { error } = validateAdmin(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let admin = await Admin.findOne({email: req.body.email});
    if (!admin) return res.status(400).send('Invalid user or password');

    const validPassword = await bcrypt.compare(req.body.password, await passwordHashing(admin.password))
    if(validPassword) return res.status(400).send('Invalid user or password');
    if(!admin.isAdmin) return res.status(403).send('Access forbidden, no admin rights');

    const token = admin.generateAuthToken()

    res.header('x-auth-token', token).send(_.pick(admin, ['_id', 'username', 'email']))

})

function validateAdmin(req) {
    const schema = Joi.object({
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(4).max(1024).required()
    })
    return schema.validate(req);
}

module.exports = router;