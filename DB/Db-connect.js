//imports
const mongoose = require("mongoose");
require("dotenv").config();

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

const connect = process.env.DB_URI ? process.env.DB_URI : process.env.DATABASE_LOCAL;

//Database connection
mongoose.connect(connect, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => { console.log(`Successfully connected to the database!!!`) });

//here I'm handling DB Error in case the server goes down i will get this message
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    db.close(() => { process.exit(1) });
});