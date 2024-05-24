const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');


const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 4,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 1024
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

AdminSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, username: this.username, email: this.email, isAdmin: this.isAdmin },
        config.get('jwtPrivateKey'),
        { expiresIn: 3600 });
    return token;
};

const Admin = mongoose.model('admins', AdminSchema);

function validateAdmin(admin) {
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(4).max(1024).required()
    });

    return schema.validate(admin);
}

function validateEmail(emailRequest) {
    const schema = Joi.object({
        email: Joi.string().email().required()
    });

    return schema.validate(emailRequest);
}

function validatePassword(pswRequest) {
    const schema = Joi.object({
        password: Joi.string().min(4).max(1024).required()
    });

    return schema.validate(pswRequest);
}

async function passwordHashing(psw) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(psw, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}

exports.Admin = Admin;
exports.validateAdmin = validateAdmin;
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.passwordHashing = passwordHashing;