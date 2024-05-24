const Joi = require('joi');
const mongoose = require('mongoose');

const MembershipSchema = new mongoose.Schema({
    membershipType: {
        type: String,
        enum: ['all-in', 'grappling-bjj', 'mma'],
        required: true
    },
    paid: {
        type: Boolean,
        default: false,
        required: true
    },
    DatePaid: {
        type: Date
    },
    MembershipExpires: {
        type: Date
    }
});

const Membership = mongoose.model('Membership', MembershipSchema);

function validateMembershipType(type) {
    const schema = Joi.object({
        membershipType: Joi.string().valid('all-in', 'grappling-bjj', 'mma').required(),
    });

    return schema.validate(type);
}

exports.MembershipSchema = MembershipSchema;
exports.validateMembershipType = validateMembershipType;