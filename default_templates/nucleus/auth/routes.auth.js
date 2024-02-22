const express = require('express')
const router = express.Router();
let auth = require('./functions.auth')

//ROUTE TO CREATE TOKEN AND LOGIN SESSION
router.post('/login', auth.login)

//VALIDATE THE TOKEN
router.post('/validate', auth.validate)

//MIDDLEWARE
router.post('/middleware', auth.middleware)

//THIS ROUTE CHANGE THE PASSWORD
router.post('/change_password/:id', auth.changePassword)

module.exports = router