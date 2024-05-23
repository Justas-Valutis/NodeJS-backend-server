const Joi = require('joi');
const mongoose = require('mongoose');

const Member = mongoose.model('members', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    lastName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    birthDate: {
        type: Date,
        min: new Date('1920-01-01'),
        max: new Date(),
        default: Date.now
    },
    gsm: {
        type: String,
        minlength: 3,
        maxlength: 25
    },
    membershipType: {
        type: String,
        enum: ['all-in', 'grappling-bjj', 'mma']
    },
    paid: {
        type: Boolean,
        default: false
    }
}));

function validateMember(member) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        birthDate: Joi.date().min('1920-01-01').max(new Date()).required(),
        gsm: Joi.string().min(3).max(25),
        email: Joi.string().email().required(),
        membershipType: Joi.string().valid('all-in', 'grappling-bjj', 'mma').required(),
        paid: Joi.boolean().required()
    });

    return schema.validate(member);
}

function validateMembershipType(type) {
    const schema = Joi.string().valid('all-in', 'grappling-bjj', 'mma');
    return schema.validate(type);
}

exports.Member = Member;
exports.validateMember = validateMember;
exports.validateMembershipType = validateMembershipType;