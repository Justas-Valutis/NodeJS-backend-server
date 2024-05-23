const express = require('express');
const home = require('./routes/home');
const members = require('./routes/members');
const admins = require('./routes/admins')
const auth = require('./routes/auth');
const config = require('config')

const app = express();
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://justas-vives:justas@nodejs-exam.dcc2ju8.mongodb.net/')
    .then(() => console.log('DB connection established'))
    .catch(err => console.error('Error connection NOT established ' + err));

app.use(express.json());
app.use('/', home)
app.use('/api/members', members)
app.use('/api/admins', admins)
app.use('/api/auth', auth)



if (!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined.');
    process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening on port ' + port));
