const { copyRecursiveSync, questionAsync, l } = require('./../functions')
const path = require('path')
const fs = require('fs')
const makeDir = require('make-dir');
const { exec } = require("child_process");

const os = require("os");

module.exports = async function ({ name }) {
    l('Welcome we gonna make another template... \t')

    const userHomeDir = os.homedir();


    let configFile = path.join(userHomeDir, '.plantillajs', 'config.js')


    if (!fs.existsSync(configFile)) {
        l('We can not find config file, please execute "configure" comand please  \t')
        return
    }

    let configJson = fs.readFileSync(configFile, { encoding: 'utf8', flag: 'r' })
    configJson = JSON.parse(configJson)


    if (!name) {
        name = questionAsync('give me the template name: ')
    } else {
        name = name[0]
    }

    let dir = path.resolve(configJson.template_folder, name)


    if (fs.existsSync(dir)) {
        l('Template already exists, try to choose other name \t')
        return
    } else {
        await makeDir(dir)
    }

    delete configJson.template_folder
    delete configJson.credentials
    configJson.name = name

    description = questionAsync('Give me the template description: ')
    if (description) {
        configJson.description = description
    }


    let functionsFile = `
    const { questionAsync } = require('plantilla/functions')
    module.exports = {
        createField = async function(field,type){
            let value = questionAsync('Give me a value')
            return "{name:field, type:type, value:value}"
        },
    }; `

    configJson.functions_file = 'functions.js'
    configJson.structure_folder = 'structure'
    configJson.execFunctions = true
    configJson.overwrite = true
    configJson.cmd = 'echo "End Proccess"'


    makeDir(path.resolve(dir, 'structure'))


    l(` ****************** Now we gonna define replacers **********************
        Replacers help us to define fragments of text that will be replaced in our template.
        There are some replacer types
            * Text(t): Every you find this patern will be replace with a text pre confured in JSON config file
            * Function(f): In every apparence will execute a function to fill or replace the match pattern, functions params must be configured as text or variables
            * Recursive(r): Executes recursively a functon to fill and replace match pattern
            * Varaible(v): Request for value from user using terminal
        a replacer could be 
            Global: Only will be requested once at start running template or
            Local: Will be requested in every appareance     
        for filenames pattern plantilla.js will use variable names    
            
    `)
    let rpl = questionAsync('Do you want to add a replacer (N)/Y: ')
    while (rpl.toLowerCase() == 'y') {
        if (!configJson.replacer) {
            configJson.replacer = []
        }
        let inner = {}
        let rpl_name = questionAsync('Give me the match name you must not include brackets {{ }} or {$ $} or any other: ')
        inner.name = rpl_name
        let rpl_type = questionAsync('Replacer match is text(t), function(f), Recursive(r) , Variable(v) *default text: ')

        if (rpl_type !== 't' && rpl_type !== 'f' && rpl_type !== 'r' && rpl_type !== 'v') {
            rpl_type = 't'
        }

        inner.type = rpl_type
        if (inner.type == 't') {
            let rpl_value = questionAsync('Give me the replacer text : ')
            inner.value = rpl_value
        }

        if (inner.type == 'f', inner.type == 'r') {
            let rpl_comma = questionAsync('Give me the parameter(must be text, or variables)  names for functions, comma separed : ')
            inner.params = rpl_comma.split(',')
        }

        if (inner.type == 'v') {
            let rpl_ask = questionAsync('Give me the replacer request variable question ex: Wich is the value for(' + inner.name + ')? : ')
            inner.ask = rpl_ask
            if (!rpl_ask) {
                inner.ask = 'Wich is the value for ' + inner.name + '?'
            }

            let rpl_typeof = questionAsync('Give me the replacer request variable typeof (object): ')
            inner.typeof = rpl_typeof
            if (!rpl_typeof) {
                inner.typeof = 'object'
            }
        }

        let rpl_global = questionAsync('Replacer is global (n)/y: ')
        inner.global = rpl_global.toLowerCase() == 'y' ? true : false

        configJson.replacer.push(inner)
        rpl = questionAsync('Do you want to add another replacer (N)/Y: ')
    }


    let sh = questionAsync('Do you want to execute a bash comand at end: echo "End Proccess" ')
    if (sh) {
        configJson.cmd = sh
    }

    fs.writeFileSync(path.resolve(dir, 'functions.js'), functionsFile, null, '\t')
    fs.writeFileSync(path.resolve(dir, 'config.json'), JSON.stringify(configJson, null, '\t'))

    l('\t template base created correctly \t')
}