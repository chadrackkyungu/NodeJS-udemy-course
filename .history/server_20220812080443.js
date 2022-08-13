// In this file you only run the server
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

require('./DB/Db-connect')

const app = require('./App');

const PORT = process.env.PORT || 5000

app.listen(PORT, () => { console.log(`listening on port ${PORT}...`) })