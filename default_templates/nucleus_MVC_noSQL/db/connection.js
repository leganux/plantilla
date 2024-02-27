
const mongoose = require("mongoose");


mongoose.connect("mongodb://localhost/test_db_api");
const connection = mongoose.connection;
connection.once("open", function () {
});


module.exports = { mongoose, connection }
