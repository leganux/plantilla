const mongoose = require('mongoose')
const moment = require('moment')

const { Schema } = mongoose;

const userModel = new Schema({
    password: {
        type: String,
        required: false
    },

    username: {
        type: String,
        required: false,
        default: ''
    },
    type_user: {
        type: String,
        required: true,
        enum: ['admin', 'client'],
        default: 'client'
    },
    name: {
        type: String,
        required: false,
        default: ''
    },
    lastname: {
        type: String,
        required: false,
        default: ''
    },
    email: {
        type: String,
        required: false,
        default: ''
    },

    picture: {
        type: String,
        required: false,
        default: false
    },

    cellphone: {
        type: String,
        required: false,
    },
    birthdate: {
        type: Date,
        required: false,
    },

    active: {
        type: Boolean,
        required: true,
        default: true
    },
    isBanned: {
        type: Boolean,
        required: true,
        default: false
    },
    custom: {
        type: mongoose.Schema.Types.Mixed,
        required: false,
        default: false
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('User', userModel)
