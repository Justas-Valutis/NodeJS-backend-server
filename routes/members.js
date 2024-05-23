const {Member, validateMember, validateMembershipType} = require('../models/member');
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    const members = await Member.find()
    if (!members) return res.status(400).send(error.details[0].message)
    res.send(members);
})

router.get('/paid=:paid', async (req, res) => {
    let givenVariable = '';
    if (req.params.paid.toLowerCase() === 'true') {
        givenVariable = 'true';
    } else if (req.params.paid.toLowerCase() === 'false') {
        givenVariable = 'false';
    } else {
        return res.status(404).send('Given value should be true or false');
    }
    const members = await Member.find({ paid: givenVariable });
    if (!members) return res.status(404).send('Members not found');

    res.send(members);
});

router.get('/name/:name', async (req, res) => {
    const member = await Member.findOne({ name: { $regex: new RegExp(req.params.name, 'i') } });
    if (!member) return res.status(404).send('Member with given name not found')

    res.send(member);
});

router.get('/:id', async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).send(`Member not found with given id: ${req.params.id}`);

        res.send(member);
    } catch (error) {
        console.error('Error fetching member by ID:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', [auth], async (req, res) => {
    const result = validateMember(req.body);
    if (result.error) return res.status(400).send(result.error.details[0].message);
    const birthDate = new Date(req.body.birthDate)
    let member = new Member({
        name: req.body.name,
        lastName: req.body.lastName,
        birthDate: birthDate,
        gsm: req.body.gsm,
        email: req.body.email,
        membershipType: req.body.membershipType,
        paid: req.body.paid
    });

    member = await member.save()
    res.send(member);
});

router.patch('/setpaid/:id', [auth], async (req, res) => {
    let member;
    try {
        member = await Member.findByIdAndUpdate(req.params.id,
            { paid: true }, { new: true });
    } catch (err) {
        return res.status(404).send(`Member not found with given id: ${req.params.id}`);
    }

    return res.send(member);
})

router.put('/:id', [auth], async (req, res) => {
    const { error } = validateMember(req.body);
    if (error) return res.status(404).send(`Member not found with given id: ${req.params.id}`);
    const birthDate = new Date(req.body.birthDate);
    let member;
    try {
        member = await Member.findByIdAndUpdate(req.params.id,
            {
                name: req.body.name,
                lastName: req.body.lastName,
                birthDate: birthDate,
                gsm: req.body.gsm,
                email: req.body.email,
                membershipType: req.body.membershipType,
                paid: req.body.paid
            }, { new: true }
        )
    } catch (err) {
        return res.status(404).send('Member not found');
    }
    res.send(member);
});

router.delete('/:id', [auth], async (req, res) => {
    let member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(400).send('Member not found');

    res.send(member);
})

router.get('/type/:type', async (req, res) => {
    const error = validateMembershipType(req.params.type);
    if (error.result) return res.status(404).send('This given type is not valid');

    const members = await Member.find({ membershipType: req.params.type });
    if (!members) return res.status(404).send('Members not found');

    res.send(members);

})

router.patch('/setmembershiptype/:id', [auth], async (req, res) => {
    const { error } = validateMembershipType(req.body.membershipType);
    if (error) return res.status(400).send('Invalid membership type');

    let member;
    try {
        member = await Member.findByIdAndUpdate(req.params.id,
            { membershipType: req.body.membershipType }, { new: true });
    } catch (err) {
        return res.status(404).send(`Member not found with given id: ${req.params.id}`);
    }

    return res.send(member);
});

module.exports = router;