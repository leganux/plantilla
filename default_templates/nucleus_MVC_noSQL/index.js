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

const session = require('express-session');
const RedisStore = require('connect-redis');
const {createClient} = require('redis')


let redisStore;
let redisClient;

if (process.env.REDIS_URL) {
    redisClient = createClient()
    redisClient.connect()
    redisStore = new RedisStore({
        client: redisClient,
        prefix: "nucleus:",
    })

} else {
    console.log("Redis is not available. Falling back to memory store.");
}

let sessionMiddleware;

if (redisClient) {
    sessionMiddleware = session({
        secret: process.env.SESSION_SECRET || 'N7Cl3usSecret_',
        resave: true,
        saveUninitialized: true,
        store: redisStore,
        cookie: {secure: false} // Set to true if using HTTPS
    });
} else {
    sessionMiddleware = session({
        secret: process.env.SESSION_SECRET || 'N7Cl3usSecret_',
        resave: true,
        saveUninitialized: true,
        cookie: {secure: false} // Set to true if using HTTPS
    });
}

app.use(sessionMiddleware);

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
