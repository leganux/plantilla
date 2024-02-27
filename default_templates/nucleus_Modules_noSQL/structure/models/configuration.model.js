const mongoose = require('mongoose')
const {Schema} = mongoose;

const configurationModel = new Schema({
    description: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true,
        default: 0
    },
    type: {
        type: String,
        required: true,
        enum: ['string', 'number', 'date', 'file', 'boolean', 'array'],
        default: 'string'
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('configurations', configurationModel)
