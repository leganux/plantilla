const express = require('express')
const router = express.Router();
let auth = require('./functions.auth')

//ROUTE TO CREATE TOKEN AND LOGIN SESSION
router.post('/login', auth.login)
router.get('/logout', auth.logout)

//VALIDATE THE TOKEN
router.post('/validate', auth.validate)

router.get('/createSession', auth.createSession)



module.exports = router
