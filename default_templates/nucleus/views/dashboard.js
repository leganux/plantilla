const express = require('express')
const router = express.Router()

let assets = require('./../config/assets.config')
let menu = require('./../config/menu.config')

let baseUrl = '/cdn/dashboard/'


router.get('/', async function (req, res) {
    let myAssets = new assets()
    myAssets = myAssets.getAssetsAdmin()

    res.status(200).render('dashboard/dashboard', {
        ...myAssets, ...menu,
        title: 'Welcome',
        breadcrubs: [
            {
                title: 'Welcome',
                href: '/dashboard',
                active: true

            }
        ]
    })
})

router.get('/demo', async function (req, res) {
    let myAssets = new assets()
    myAssets = myAssets.getAssetsAdmin()
    myAssets.scripts.push(baseUrl + 'dist/js/demo.js')
    res.status(200).render('dashboard/demo', {
        ...myAssets, ...menu,
        title: 'Welcome',
        breadcrubs: [
            {
                title: 'Welcome',
                href: '/dashboard',
                active: false

            }, {
                title: 'Demo',
                href: '/dashboard/demo',
                active: true

            }
        ]

    })
})
router.get('/users', async function (req, res) {
    let myAssets = new assets()
    myAssets = myAssets.getAssetsAdmin()
    res.status(200).render('dashboard/users', {
        ...myAssets, ...menu,
        title: 'Users',
        breadcrubs: [
            {
                title: 'Welcome',
                href: '/dashboard',
                active: false

            },
            {
                title: 'Users',
                href: '/dashboard/users',
                active: true

            }
        ]

    })
})

/** Here routes*/

module.exports = router