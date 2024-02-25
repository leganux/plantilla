const mongoose = require('mongoose')
const moment = require('moment')

const {Schema} = mongoose;

const userModel = new Schema({
    password: {
        type: String,
        required: false,
        customName: 'Password',
        isPassword: true
    },

    username: {
        type: String,
        required: true,
        default: '',
        customName: 'Username',
    },
    type_user: {
        type: String,
        required: true,
        enum: ['admin', 'client'],
        default: 'client',
        customName: 'Type of user',
    },
    name: {
        type: String,
        required: false,
        default: '',
        customName: 'Name',
    },
    lastname: {
        type: String,
        required: false,
        default: '',
        customName: 'Last name',
    },
    email: {
        type: String,
        required: false,
        default: '',
        customName: 'Email',
    },

    picture: {
        type: String,
        required: false,
        default: false,
        isFile: true,
        customName: 'Profile Picture',
    },

    cellphone: {
        type: String,
        required: false,
        customName: 'Cellphone number',
    },
    birthdate: {
        type: Date,
        required: false,
        customName: 'Birth date',
    },

    active: {
        type: Boolean,
        required: true,
        default: true,
        customName: 'Active',
    },
    isBanned: {
        type: Boolean,
        required: true,
        default: false,
        customName: 'Banned User',
    },


}, {
    timestamps: true
})


module.exports = mongoose.model('User', userModel)
