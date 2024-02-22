const userModel = require('./../models/user.model')
const jwt = require('jsonwebtoken')
const { Crypt } = require('unpc')
const { SCryptHashingAdapter } = require('unpc/scrypt')
const crypt = new Crypt({
    default: 'scrypt',
    adapters: [SCryptHashingAdapter],
    options: { encoding: "hex" }
})
const mongoose = require('mongoose')
require('dotenv').config()

//LOGIN TO USER, AND GENERATE TOKEN
let login = async function (req, res) {
    let { password } = req.body
    let { username } = req.body
    let headers = req?.headers?.__ || 'null'


    try {
        let allUsers = await userModel.find()

        let user = await userModel.findOne({
            $or: [
                { username },
                { cellphone: Number(username) }
            ]
        }).select(['password', 'username', 'name', 'lastname', 'email', 'type_user', 'cellphone', 'active'])


        if (!user) {
            return res.status(403).json({
                message: 'Usuario o contraseña incorrectos',
                success: false,
                error: { message: 'Usuario o contraseña incorrectos' }
            })
        }

        if (!await crypt.verify(user.password, password.trim())) {
            return res.status(403).json({
                message: 'Usuario o contraseña incorrectos',
                success: false,
                error: { message: 'Usuario o contraseña incorrectos' }
            })
        }

        let token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12),
            data: user
        },
            process.env.JWT_SECRET_KEY)

        user.fp = headers
        await user.save()

        res.status(200).json({
            message: 'Success',
            success: true,
            error: {},
            data: { token, user }
        })

    } catch (e) {
        console.error('EL error al longin ', e)
        res.status(500).json({
            message: 'Error: ' + e.message,
            success: true,
            error: { e }
        })
    }
}

//VALIDATE THE TOKEN SESSION
let validate = async function (req, res) {
    try {
        let token = req?.headers?.authorization || 'null'
        let fp = req?.headers?.__ || 'null'

        if (token.includes('Bearer')) {
            token = token.replace('Bearer ', '').trim()
        }
        let payload = jwt.verify(token, process.env.JWT_SECRET_KEY)

        if (!payload) {
            return res.status(403).json({
                message: 'Sesión  no valida o caducada. reingrese por favor',
                success: false,
                error: 'Sesión  no valida o caducada. reingrese por favor'
            })
        }

        let user = await userModel.findById(payload.data._id).select([
            'password', 'username', 'name', 'lastname', 'email', 'type_user', 'cellphone', 'active',
        ])

        if (!user) {
            return res.status(404).json({
                message: 'Este usuario no existe',
                success: false,
                error: 'Este usuario no existe'
            })
        }

        if (user.status) {
            return res.status(403).json({
                message: 'Usuario inactivo',
                success: false,
                error: 'Error: Usuario Inactivo'
            })
        }



        return res.status(200).json({
            message: 'Success',
            success: true,
        })

    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: 'Ocurrio un error: ' + e.message,
            success: false,
            error: { e }
        })
    }
}

//MIDDLEWARE
let middleware = async function (req, res, next) {

    try {

        let token = req?.headers?.authorization || 'null'
        if (token.includes('Bearer')) {
            token = token.replace('Bearer ', '').trim()
        }

        let payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!payload) {
            return res.status(403).json({
                message: 'Sesión no valida o caducada. Por favor vuelve a iniciar sesión',
                success: false,
                error: 'Sesión no valida o caducada. Por favor vuelve a iniciar sesión'
            })
        }

        let user = await userModel.findById(payload.data._id)
        if (!user) {
            return res.status(403).json({
                message: 'Este usuario no existe',
                success: false,
                error: 'Este usuario no existe'
            })
        }

        if (!user.status) {
            return res.status(403).json({
                message: 'Usuario inactivo',
                success: false,
                error: 'Error: Usuario Inactivo'
            })
        }

        req.user = user
        next()

    } catch (e) {
        res.status(500).json({
            message: 'Error: ' + e.message,
            success: false,
            error: { e }
        })
    }
}

//CHANGE PASSWORD
let changePassword = async function (req, res) {
    let { new_password } = req.body
    let id = req.params.id

    try {

        let find_user = await userModel.findById({ _id: new mongoose.Types.ObjectId(id) })

        if (!find_user) {
            return res.status(500).json({
                message: 'Este usuario no existe',
                success: false,
                error: {}
            })
        }


        new_password = await crypt.hash(new_password)
        await userModel.findByIdAndUpdate({ _id: find_user._id }, {
            $set: {
                password: new_password
            }
        })

        res.status(200).json({
            message: 'Success',
            success: true,
            error: {}
        })
    } catch (e) {
        res.status(500).json({
            message: e.message,
            success: false,
            error: { e }
        })
    }
}

//EXPORT FUNCTIONS
module.exports = {
    login,
    validate,
    middleware,
    changePassword,
}
