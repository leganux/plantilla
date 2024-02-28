const mongoose = require("mongoose");


mongoose.connect(process.env.DB_URI || "mongodb://localhost/nucleus_MVC_noSQL");
const connection = mongoose.connection;
connection.once("open", function () {
});


module.exports = {mongoose, connection}
