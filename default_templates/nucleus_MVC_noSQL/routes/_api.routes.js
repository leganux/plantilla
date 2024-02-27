const express = require('express')
const router = express.Router()

router.use('/user', require('./user.router'))

/** Here routes*/

module.exports = router