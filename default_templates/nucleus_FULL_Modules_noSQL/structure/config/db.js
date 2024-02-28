const mongoose = require("mongoose");


mongoose.connect(process.env.DB_URI || "mongodb://localhost/nucleus_MVC_noSQL");
const db = mongoose.connection;
db.once("open", function () {
});


module.exports = {mongoose, connection: db}
