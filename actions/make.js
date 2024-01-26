const {copyRecursiveSync, questionAsync, l} = require('./../functions')
const path = require('path')
const fs = require('fs')
const makeDir = require('make-dir');
const {exec} = require("child_process");

const os = require("os");
const v = require("voca");
const moment = require("moment");

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}


module.exports = async function ({name}) {
    l('Welcome we gonna make another template... \t')

    const userHomeDir = os.homedir();


    let configFile = path.join(userHomeDir, '.plantillajs', 'config.js')


    if (!fs.existsSync(configFile)) {
        l('We can not find config file, please execute "configure" comand please  \t')
        return
    }

    let configJson = fs.readFileSync(configFile, {encoding: 'utf8', flag: 'r'})
    configJson = JSON.parse(configJson)


    if (!name) {
        name = questionAsync('Give me the template name: ')
    } else {
        name = name[0]
    }

    name = v.snakeCase(name)

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
    
    module.exports = {
     {{functions_list}}
    }; `

    configJson.functions_file = 'functions.js'
    configJson.structure_folder = 'structure'
    configJson.execFunctions = true
    configJson.overwrite = true
    configJson.cmd = 'echo "End Proccess"'


    makeDir(path.resolve(dir, 'structure'))

    let function_list = ''

    l(` ****************** Now we gonna define replacers **********************
    
        Replacers help us to define fragments of text that will be replaced in your template.
        There are some replacer types
            * Function(f): In every appearance will call function to fill space
            * Varaible(v): Only replace a text with other
            * File Names(n):Replace text in  files
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

        let rpl_type = questionAsync('Replacer match is function(f), Variable(v), File Name(n) (Default:v): ')

        if (rpl_type !== 'n' && rpl_type !== 'f' && rpl_type !== 'v') {
            rpl_type = 'v'
        }
        inner.type = rpl_type

        if (inner.type.toLowerCase() == 'f') {
            let rpl_name = questionAsync('Give me the name for function: ')
            if (rpl_name) {
                inner.name = rpl_name
            } else {
                inner.name = 'function_' + makeid(5)
            }
            let rpl_comma = questionAsync('Give me the parameters for function, comma separated (Example: name,description,field1): ')
            inner.params = rpl_comma?.split(',') || []

            function_list = function_list + ` ${inner.name} : async function (${inner?.params?.join(',')}){ \n\n//** Important the return must be a string fragment of template \nreturn '' \n }, `
        }

        if (inner.type.toLowerCase() == 'v') {
            let rpl_name = questionAsync('Give me the name for variable: ')
            if (rpl_name) {
                inner.name = rpl_name
            } else {
                inner.name = 'variable_' + makeid(7)
            }

            let rpl_ask = questionAsync('Give me the replacer request variable question (Default: Which is the value for ' + inner.name + '?): ')
            inner.ask = rpl_ask
            if (!rpl_ask || rpl_ask.trim().toLowerCase() == 'y') {
                inner.ask = 'Which is the value for ' + inner.name + '?'
            }

            let rpl_typeof = questionAsync('What kind of datatype is the variable string,number,date,boolean,array,object (Default: string): ')
            inner.typeof = rpl_typeof
            if (!rpl_typeof || rpl_typeof.toLowerCase() == 'y') {
                inner.typeof = 'string'
            }
        }

        if (inner.type.toLowerCase() == 'n') {
            let rpl_name = questionAsync('Give me the name for file name variable: ')
            if (rpl_name) {
                inner.name = rpl_name
            } else {
                inner.name = 'fileName_' + makeid(11)
            }

            let rpl_ask = questionAsync('Give me the replacer request file name question (Default: Which is the value for ' + inner.name + '?): ')
            inner.ask = rpl_ask
            if (!rpl_ask || rpl_ask.trim().toLowerCase() == 'y') {
                inner.ask = 'Which is the value for ' + inner.name + '?'
            }


        }

        let rpl_global = questionAsync('Replacer is global (n)/y: ')
        inner.global = rpl_global.toLowerCase() == 'y' ? true : false


        configJson.replacer.push(inner)
        rpl = questionAsync('Do you want to add another replacer (N)/Y: ')
    }


    let sh = questionAsync('Do you want to execute a bash command at end (Example: echo "End Process") ')
    if (sh && sh.toLowerCase() != 'y') {
        configJson.cmd = sh
    }else {
        configJson.cmd = ''
    }

    functionsFile = functionsFile.replaceAll('{{functions_list}}', function_list)

    fs.writeFileSync(path.resolve(dir, 'functions.js'), functionsFile)
    fs.writeFileSync(path.resolve(dir, 'config.json'), JSON.stringify(configJson, null, '\t'))

    l('\t Template ' + configJson.name + ' created correctly \t')
}
