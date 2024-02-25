try {
    require('dotenv').config()
} catch (e) {
}

const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const morgan = require('morgan')
const path = require('path')

const http = require('http');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors())


require('./db/connection.js')

app.use('/cdn', express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}))


app.use('/auth', require('./auth/routes.auth'))
app.use('/api', require('./routes/_api.routes'))
app.use('/', require('./views/site.js'))
app.use('/dashboard', require('./views/dashboard.js'))


//CREATE SERVER HTTP
const server = http.createServer(app)

server.listen(process.env.API_PORT | 1111, () => {
    console.log('started at');
    console.log('http://localhost:' + (String(process.env.API_PORT) | '1111'));
});

/* Active this part to use  files storage
const tresComas = require("tres-comas");

let files = {}

let AWSConf = {
    bucket: process.env.BUCKET_AWS,
    acl: "public-read",
    contentDisposition: "inline",// 'attachment',
    serverSideEncryption: false, //'AES256',
    contentEncoding: false,
    region: process.env.AWS_REGION,
    aws_access_key_id: process.env.KEY_ID_AWS,
    aws_secret_access_key: process.env.SECRET_KEY_AWS,
}

let optionsUploadImages = {
    api_base_uri: '/api/files/',
    activeLogRequest: true,
    active_cors: true,
    collection_name: "multimedias",
    public_folder: "archive",
    path_folder: "files",
    allow_public: true,
    limits: {
        fileSize: Infinity,
        filesArray: 10
    },
    structure_folder: "date",
    custom_folder_name: false,
    engine: "aws-s3",
    app: app,
    mongoose: db.mongoose,
    connect: AWSConf,
}

files = new tresComas(process.env.MDB_API_URI, false, optionsUploadImages)
files.initialize()
files.publishServerStats()


let { model, schema } = files.getMongooseInstanceApp()
module.exports.files = model.FILES
module.exports.uploadFileS3 = async function (filePath, dest) {
    try {
        return await files.uploadFileS3(filePath, dest)
    } catch (e) {
        throw e
    }

}
*/


//CREATE ONE ADMIN IF THERE AREN'T ADMINS
require('./helpers/check_admins.helper')
