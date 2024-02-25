let {fakeRequestFunction, fakeResponseFunction} = require('ex-js-faker-request')

let api = async function (controllerFunction, req) {
    if (!controllerFunction) {
        throw 'Please add a function to execute'
    }

    if (typeof controllerFunction != 'function') {
        throw 'Controller function its not a function'
    }

    try {
        let fakeRes = new fakeResponseFunction()
        let fakeReq = new fakeRequestFunction(req)

        await controllerFunction(fakeReq, fakeRes)

        if (String(fakeRes.status_).in(['200', '201', '202', '204', '203'])) {
            return fakeRes?.json_
        } else {
            console.error('Error en fake request')
            throw fakeRes?.json_
        }

    } catch (e) {
        console.error('Error en fake, request')
        throw e
    }
}

module.exports = {
    api,
    code_rag: function () {
        this.token = 'Bearer NONE'
        this.resource = false
        this.controller = false
        this.setResource = function (resource = false) {
            let el = this
            if (resource) {
                el.resource = resource
                try {
                    el.controller = require('./../controllers/' + resource + '.controller.js')
                } catch (e) {
                    throw e
                }
            }
            return el
        }
        this.createOne = async function (body = {}, query = {}, headers = {}) {
            let el = this
            if (!el.resource || !el.controller) {
                throw new Error('Resource not selected')
                return
            }
            if (!el?.controller?.createOne || typeof el?.controller?.createOne != 'function') {
                throw new Error('Resource has no acces to createOneFunction')
                return
            }
            let req = {
                body, query, headers
            }
            try {
                let resp = await api(el?.controller?.createOne, req)
                return resp
            } catch (e) {
                throw e
            }
        }
        this.createMany = async function (body = [], query = {}, headers = {}) {
            let el = this
            if (!el.resource || !el.controller) {
                throw new Error('Resource not selected')
                return
            }
            if (!el?.controller?.createMany || typeof el?.controller?.createMany != 'function') {
                throw new Error('Resource has no acces to createOneFunction')
                return
            }
            let req = {
                body, query, headers
            }
            try {
                let resp = await api(el?.controller?.createMany, req)
                return resp
            } catch (e) {
                throw e
            }
        }
        this.getMany = async function (query = {}, headers = {}) {
            let el = this
            if (!el.resource || !el.controller) {
                throw new Error('Resource not selected')
                return
            }
            if (!el?.controller?.getMany || typeof el?.controller?.getMany != 'function') {
                throw new Error('Resource has no acces to createOneFunction')
                return
            }
            let req = {
                query, headers
            }
            try {
                let resp = await api(el?.controller?.getMany, req)
                return resp
            } catch (e) {
                throw e
            }
        }
        this.getOneWhere = async function (query = {}, headers = {}) {
            let el = this
            if (!el.resource || !el.controller) {
                throw new Error('Resource not selected')
                return
            }
            if (!el?.controller?.getOneWhere || typeof el?.controller?.getOneWhere != 'function') {
                throw new Error('Resource has no acces to createOneFunction')
                return
            }
            let req = {
                query, headers
            }
            try {
                let resp = await api(el?.controller?.getOneWhere, req)
                return resp
            } catch (e) {
                throw e
            }
        }
        this.getOneById = async function (id = '', query = {}, headers = {}) {
            let el = this
            if (!el.resource || !el.controller) {
                throw new Error('Resource not selected')
                return
            }
            if (!el?.controller?.getOneById || typeof el?.controller?.getOneById != 'function') {
                throw new Error('Resource has no acces to createOneFunction')
                return
            }
            let req = {
                query, params: {id}, headers
            }
            try {
                let resp = await api(el?.controller?.getOneById, req)
                return resp
            } catch (e) {
                throw e
            }
        }
        this.findUpdateOrCreate = async function (body = {}, query = {}, headers = {}) {
            let el = this
            if (!el.resource || !el.controller) {
                throw new Error('Resource not selected')
                return
            }
            if (!el?.controller?.findUpdateOrCreate || typeof el?.controller?.findUpdateOrCreate != 'function') {
                throw new Error('Resource has no acces to createOneFunction')
                return
            }
            let req = {
                query, body, headers
            }
            try {
                let resp = await api(el?.controller?.findUpdateOrCreate, req)
                return resp
            } catch (e) {
                throw e
            }

        }
        this.findUpdate = async function (body = {}, query = {}, headers = {}) {
            let el = this
            if (!el.resource || !el.controller) {
                throw new Error('Resource not selected')
                return
            }
            if (!el?.controller?.findUpdate || typeof el?.controller?.findUpdate != 'function') {
                throw new Error('Resource has no acces to createOneFunction')
                return
            }
            let req = {
                query, body, headers
            }
            try {
                let resp = await api(el?.controller?.findUpdate, req)
                return resp
            } catch (e) {
                throw e
            }
        }
        this.updateById = async function (id = '', body = {}, query = {}, headers = {}) {
            let el = this
            if (!el.resource || !el.controller) {
                throw new Error('Resource not selected')
                return
            }
            if (!el?.controller?.updateById || typeof el?.controller?.updateById != 'function') {
                throw new Error('Resource has no acces to createOneFunction')
                return
            }
            let req = {
                query, body, params: {id}, headers
            }
            try {
                let resp = await api(el?.controller?.updateById, req)
                return resp
            } catch (e) {
                throw e
            }
        }
        this.findIdAndDelete = async function (id = '', body = {}, query = {}, headers = {}) {
            let el = this
            if (!el.resource || !el.controller) {
                throw new Error('Resource not selected')
                return
            }
            if (!el?.controller?.findIdAndDelete || typeof el?.controller?.findIdAndDelete != 'function') {
                throw new Error('Resource has no acces to createOneFunction')
                return
            }
            let req = {
                query, body, params: {id}, headers
            }
            try {
                let resp = await api(el?.controller?.findIdAndDelete, req)
                return resp
            } catch (e) {
                throw e
            }
        }

    }
}
