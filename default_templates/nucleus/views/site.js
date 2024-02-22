const express = require('express')
const router = express.Router()



router.get('/', async function (req, res) {
    res.status(200).render('site/start')
})

/** Here routes*/

module.exports = router