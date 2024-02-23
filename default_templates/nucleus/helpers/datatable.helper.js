const {Schema} = require("mongoose");

module.exports = {
    dt_constructor: async function ({model, actions}) {
        let schema = model.schema.tree
        let name = model.modelName.toLowerCase()
        let columns = []

        for (let [key, val] of Object.entries(schema)) {

            let myType = ''

            if (key != 'id' && key != '__v') {
                let order = 0

                if (typeof val == 'object') {
                    if (val.type == String) {
                        myType = 'string'
                        order = 1
                    } else if (val.type == Number) {
                        myType = 'number'
                        order = 2
                    } else if (val.type == Date) {
                        myType = 'date'
                        order = 3
                    } else if (val.type == Boolean) {
                        myType = 'boolean'
                        order = 4
                    } else if (val.type == 'ObjectId') {
                        myType = 'objectid'
                        order = 0
                    } else if (val.type == Schema.Types.Mixed) {
                        myType = 'mixed'
                        order = 5
                    } else {
                        myType = 'object'
                        order = 5
                    }


                    columns.push({
                        name: key,
                        type: myType,
                        default: val.default ? val.default : null,
                        required: val.required ? val.required : false,
                        order,
                        enum: val.enum ? val.enum : false
                    })
                } else {
                    if (val == 'ObjectId') {
                        myType = 'objectid'
                        order = 0
                    } else if (val == Schema.Types.Mixed) {
                        myType = 'mixed'
                        order = 5
                    } else if (val == String) {
                        myType = 'string'
                        order = 1
                    } else if (val == Number) {
                        myType = 'number'
                        order = 2
                    } else if (val == Date) {
                        myType = 'date'
                        order = 3
                    } else if (val == Boolean) {
                        myType = 'boolean'
                        order = 4
                    } else {
                        myType = 'object'
                        order = 5
                    }
                    columns.push({
                        name: key,
                        type: myType,
                        default: null,
                        required: false,
                        order,
                        enum: false
                    })
                }


            }
        }

        columns = columns.sort((a, b) => {
            if (a.order !== b.order) {
                return a.order - b.order;
            }
            // Si los números son iguales, entonces comparamos por cadena de texto
            return a.name.localeCompare(b.name);
        });

        let arrActions = []

        if (typeof actions == "string") {
            arrActions = actions.split(',')
        }
        if (Array.isArray(actions)) {
            arrActions = actions
        }
        arrActions = arrActions.map(item => item.toLowerCase())
        let ObjActions = {}
        for (let item of arrActions) {
            ObjActions[item] = true
        }
        columns.push({
            name: 'actions',
            type: '_ACTIONS_',
            default: arrActions,
            required: arrActions.length > 0,
            order: 6,
            enum: false
        })
        console.table(columns)
        return {columns, name, actions: ObjActions}
    }
}
