const jwt = require('jsonwebtoken')
const {Crypt} = require('unpc')
const {SCryptHashingAdapter} = require('unpc/scrypt')
const crypt = new Crypt({
    default: 'scrypt',
    adapters: [SCryptHashingAdapter],
    options: {encoding: "hex"}
})
let jwt_pass = process.env.JWT_SECRET_KEY || 'nucleus_jwt_secret'

let {CodeRag} = require('./../helpers/backend-code-rag.helper')
let api = new CodeRag()

api.setResource('user')

let login = async function (req, res) {
    let {password} = req.body
    let {email} = req.body


    try {

        let user = await api.getOneWhere(
            {
                where: {
                    email: email
                }, select: {
                    'password': 1,
                    'username': 1,
                    'name': 1,
                    'lastname': 1,
                    'email': 1,
                    'type_user': 1,
                    'cellphone': 1,
                    'active': 1
                }
            })


        if (!user || !user.data) {
            return res.status(403).json({
                message: 'Usuario o contraseña incorrectos',
                success: false,
                error: {message: 'Usuario o contraseña incorrectos'}
            })
        }
        user = user.data

        if (!await crypt.verify(user.password, password.trim())) {
            return res.status(403).json({
                message: 'Usuario o contraseña incorrectos',
                success: false,
                error: {message: 'Usuario o contraseña incorrectos'}
            })
        }

        let token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 12),
                data: user
            },
            jwt_pass)

        delete user.password
        res.status(200).json({
            message: 'Success',
            success: true,
            error: {},
            data: {token, user}
        })

    } catch (e) {
        console.error('EL error al longin ', e)
        res.status(500).json({
            message: 'Error: ' + e.message,
            success: true,
            error: {e}
        })
    }
}

//VALIDATE THE TOKEN SESSION
let validate = async function (req, res) {
    try {
        let token = req?.headers?.authorization || req?.query?.token || 'null'

        console.log(token)
        if (token.includes('Bearer')) {
            token = token.replace('Bearer ', '').trim()
        }
        let payload;
        try {
            payload = jwt.verify(token, jwt_pass)
        } catch (e) {
            console.error(e)
            return res.status(403).json({
                message: 'Sesión  no valida o caducada. reingrese por favor',
                success: false,
                error: 'Sesión  no valida o caducada. reingrese por favor'
            })
        }


        if (!payload) {
            return res.status(403).json({
                message: 'Sesión  no valida o caducada. reingrese por favor',
                success: false,
                error: 'Sesión  no valida o caducada. reingrese por favor'
            })
        }

        let user = await api.getOneById(payload.data._id, {
            select: {
                'password': 1,
                'username': 1,
                'name': 1,
                'lastname': 1,
                'email': 1,
                'type_user': 1,
                'cellphone': 1,
                'active': 1,

            }
        })

        if (!user || !user.data) {
            return res.status(404).json({
                message: 'Este usuario no existe',
                success: false,
                error: 'Este usuario no existe'
            })
        }
        user = user.data

        if (!user.active) {
            return res.status(403).json({
                message: 'Usuario inactivo',
                success: false,
                error: 'Error: Usuario Inactivo'
            })
        }

        delete user.password
        return res.status(200).json({
            message: 'Success',
            success: true,
            user
        })

    } catch (e) {
        console.error(e)
        res.status(500).json({
            message: 'Ocurrio un error: ' + e.message,
            success: false,
            error: {e}
        })
    }
}


let createSession = async function (req, res, next) {
    try {
        let token = req?.headers?.authorization || req?.query?.token || 'null'
        let redirect = req?.query?.redirect || '/dashboard'


        if (token.includes('Bearer')) {
            token = token.replace('Bearer ', '').trim()
        }
        let payload;
        try {
            payload = jwt.verify(token, jwt_pass)
        } catch (e) {
            console.error(e)
            return res.status(403).redirect('/dashboard/login?message=invalid_token')
        }


        if (!payload) {
            return res.status(403).redirect('/dashboard/login?message=invalid_token')
        }

        let user = await api.getOneById(payload.data._id, {
            select: {
                'password': 1,
                'username': 1,
                'name': 1,
                'lastname': 1,
                'email': 1,
                'type_user': 1,
                'cellphone': 1,
                'active': 1,

            }
        })

        if (!user || !user.data) {
            return res.status(403).redirect('/dashboard/login?message=notfound')
        }
        user = user.data

        if (!user.active) {
            return res.status(403).redirect('/dashboard/login?message=inactive')
        }

        req.session.regenerate(function (err) {
            if (err) return res.status(403).redirect('/dashboard/login?message=session')

            // store user information in session, typically a user id
            req.session.user = user
            req.session.token = token

            // save the session before redirection to ensure page
            // load does not happen before session is saved
            req.session.save(function (err) {
                if (err) return res.status(403).redirect('/dashboard/login?message=session')
                return res.status(304).redirect(redirect)
            })
        })


    } catch (e) {
        console.error(e)
        return res.status(403).redirect('/dashboard/login?message=server_error')
    }
}

let logout = async function (req, res, next) {
    req.session.user = null
    req.session.save(function (err) {
        if (err) next(err)

        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate(function (err) {
            if (err) next(err)
            res.redirect('/')
        })
    })
}

//MIDDLEWARE
/*TODO must to validate roles and profiles*/
let middleware = async function (req, res, next) {

    try {

        console.log('This middleware only validates session')
        let user = req?.session?.user || null
        if (!user) {
            let token = req?.headers?.authorization || req?.query?.token || 'null'
            if (token.includes('Bearer')) {
                token = token.replace('Bearer ', '').trim()
            }

            let payload;
            try {
                payload = jwt.verify(token, jwt_pass)
            } catch (e) {
                console.error(e)
                return res.status(403).redirect('/dashboard/login?message=invalid_token')
            }

            if (!payload) {
                return res.status(403).redirect('/dashboard/login?message=invalid_token')
            }

            let user = await api.getOneById(payload.data._id, {
                select: {
                    'password': 1,
                    'username': 1,
                    'name': 1,
                    'lastname': 1,
                    'email': 1,
                    'type_user': 1,
                    'cellphone': 1,
                    'active': 1,

                }
            })

            if (!user || !user.data) {
                return res.status(403).redirect('/dashboard/login?message=notfound')
            }
            user = user.data

            if (!user.active) {
                return res.status(403).redirect('/dashboard/login?message=inactive')
            }
        }
        console.log('session', user)

        req.user = user
        next()

    } catch (e) {
        console.error(e)
        return res.status(500).redirect('/dashboard/login?message=server_error')
    }
}
let middleware_api = async function (req, res, next) {

    try {

        let user = req?.session?.user
        if (!user) {
            let token = req?.headers?.authorization || req?.query?.token || 'null'
            if (token.includes('Bearer')) {
                token = token.replace('Bearer ', '').trim()
            }

            let payload;
            try {
                payload = jwt.verify(token, jwt_pass)
            } catch (e) {
                console.error(e)
                return res.status(403).json({
                    success: false,
                    code: 403,
                    error: 'Invalid token'
                })
            }

            if (!payload) {
                return res.status(403).json({
                    success: false,
                    code: 403,
                    error: 'Invalid token'
                })
            }

            let user = await api.getOneById(payload.data._id, {
                select: {
                    'password': 1,
                    'username': 1,
                    'name': 1,
                    'lastname': 1,
                    'email': 1,
                    'type_user': 1,
                    'cellphone': 1,
                    'active': 1,

                }
            })

            if (!user || !user.data) {
                return res.status(403).json({
                    success: false,
                    code: 403,
                    error: 'No user found'
                })
            }
            user = user.data

            if (!user.active) {
                return res.status(403).json({
                    success: false,
                    code: 403,
                    error: 'Inactive User'
                })
            }
        }

        req.user = user
        next()

    } catch (e) {
        res.status(500).json({
            message: 'Error: ' + e.message,
            success: false,
            error: {e}
        })
    }
}


//EXPORT FUNCTIONS
module.exports = {
    login,
    validate,
    middleware,
    middleware_api,
    createSession,
    logout
}
