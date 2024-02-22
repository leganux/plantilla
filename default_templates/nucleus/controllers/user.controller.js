let ms = require('../helpers/apiato.helper.js')
const userModel = require('../models/user.model')
const mongoose = require('mongoose')

let validationObject = {}

let populationObject = false

let options = {}

let aggregate_pipeline_dt = []

let aggregate_pipeline = []


module.exports = {
    createOne: ms.createOne(userModel, validationObject, populationObject, options),
    createMany: ms.createMany(userModel, validationObject, populationObject, options),

    getOneWhere: ms.getOneWhere(userModel, validationObject, populationObject, options),
    getOneById: ms.getOneById(userModel, validationObject, populationObject, options),
    getMany: ms.getMany(userModel, validationObject, populationObject, options),

    findUpdateOrCreate: ms.findUpdateOrCreate(userModel, validationObject, populationObject, options),
    findUpdate: ms.findUpdate(userModel, validationObject, populationObject, options),
    updateById: ms.updateById(userModel, validationObject, populationObject, options),

    findByIdAndDelete: ms.findIdAndDelete(userModel, options),

    datatable_aggregate: ms.datatable_aggregate(userModel, aggregate_pipeline_dt, ''),
    aggregate: ms.updateById(userModel, aggregate_pipeline, options),
}