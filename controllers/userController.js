const fs = require('fs');

//! OBJECT DATA
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dummy-data/tours-simple.json`));

//Functions
exports.getAllUsers = (req, res) => {
    res.status(500).json({ status: 'error', message: "this route is not yet defined" })
}
exports.createUser = (req, res) => {
    res.status(500).json({ status: 'error', message: "this route is not yet defined" })
}
exports.getUser = (req, res) => {
    res.status(500).json({ status: 'error', message: "this route is not yet defined" })
}
exports.updateUser = (req, res) => {
    res.status(500).json({ status: 'error', message: "this route is not yet defined" })
}
exports.deleteUser = (req, res) => {
    res.status(500).json({ status: 'error', message: "this route is not yet defined" })
}