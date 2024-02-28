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


require('./config/db.js')


app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}))


app.use('/auth', require('./modules/auth/routes.auth'))
app.use('/api', require('./modules/_api.routes'))

app.all('/', function (req, res) {
    res.status(200).json({
        message: 'Nucleus ok',
        status: 200,
        success: true,
        data: [],
        error: false
    })
})
app.all('/*', function (req, res) {
    res.status(404).json({
        message: 'Not found',
        status: 404,
        success: true,
        data: [],
        error: 'Not found'
    })
})


//CREATE SERVER HTTP
const server = http.createServer(app)

server.listen(process.env.API_PORT | 1111, () => {
    console.log('started at');
    console.log('http://localhost:' + (String(process.env.API_PORT) | '1111'));
});


//CREATE ONE ADMIN IF THERE AREN'T ADMINS
require('./helpers/check_admins.helper')
