const express = require('express')
const router = express.Router()

router.use('/user', require('./user/user.router'))

/** Here routes*/

module.exports = router
