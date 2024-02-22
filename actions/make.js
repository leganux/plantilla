const {copyRecursiveSync, questionAsync, l} = require('./../functions')
const path = require('path')
const fs = require('fs')
const makeDir = require('make-dir');
const {exec} = require("child_process");
const {promisify} = require('util');
const os = require("os");
const v = require("voca");
const moment = require("moment");
const execAsync = promisify(exec);


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

let ExResponse = {
    success: true,
    message: "Function executed correctly",
    template: "/* the formatted string of template to replace match */"
}

ExResponse = JSON.stringify(ExResponse)
module.exports = async function ({name}) {
    l('Welcome we gonna make another template... \t')

    const userHomeDir = os.homedir();


    let configFile = path.join(userHomeDir, '.plantillajs', 'config.js')
    let esLint = path.join(userHomeDir, '.plantillajs', '.eslintrc.js')


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
            * Function(f): In every appearance will call function to fill space, could be recursive to call many times
            * Variable(v): Only replace a text with other
            * File Names(n):Replace text in  files 
        a replacer could be 
            Global: Only will be requested once at start running template or
            Local: Will be requested in every appearance     
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

            function_list = function_list + ` ${inner.name} : async function ({${inner?.params?.join(',')}}){ \n\n//** Important the return must be an object with info and template \nreturn ${ExResponse} \n }, `
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
            inner.typeof = 'string'

        }

        let rpl_global = questionAsync('Replacer is global (n)/y: ')
        inner.global = rpl_global.toLowerCase() == 'y' ? true : false


        if (inner.type == 'f' && !inner.global) {
            let rpl_recursive = questionAsync('Function will be recursive,< it will be executed many times > Y/(N) : ')
            inner.recursive = rpl_recursive.toLowerCase() == 'y' ? true : false
        }

        configJson.replacer.push(inner)
        rpl = questionAsync('Do you want to add another replacer (N)/Y: ')
    }

    l(` ****************** Now we gonna define appendix  **********************
    
        Appendix help us to define fragments of text that will be replaced in already created code.
        There are some appendix types
            * Function(f): In every appearance will call function to fill space, could be recursive to call many times
            * Variable(v): Only replace a text with other
        an appendix could be 
            Global: Only will be requested once at start running template or
            Local: Will be requested in every appearance
        For appendix its necessary to write a custom match substring to search in file to put new text "before" or "after"
        and its necessary to establish the file path (from root project) where text where established   
                 
           
            
    `)


    let apx = questionAsync('Do you want to add an appendix (N)/Y: ')
    while (apx.toLowerCase() == 'y') {
        if (!configJson.appendix) {
            configJson.appendix = []
        }
        let inner = {}


        let rpl_match = questionAsync('Give me the match string for appendix (Example: /*this is a comment for appendix*/ ): ')
        if (rpl_match) {
            inner.match = rpl_match
        } else {
            inner.match = '/*this is a comment for appendix*/'
        }

        let rpl_position = questionAsync('Where you put new text before/after (Default: before ): ')
        if (rpl_position != 'after') {
            inner.position = 'before'
        } else {
            inner.position = 'after'
        }

        let rpl_file = questionAsync('Give me the path of file from root project folder to add appendix (Example: /router/api.js ): ')
        if (rpl_file != '') {
            inner.dir = rpl_file
        } else {
            inner.dir = '/router/api.js'
        }

        let rpl_type = questionAsync('Appendix match is function(f), Variable(v) (Default:v): ')

        if (rpl_type !== 'f' && rpl_type !== 'v') {
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

            function_list = function_list + ` ${inner.name} : async function ({${inner?.params?.join(',')}}){ \n\n//** Important the return must be an object with info and template \nreturn ${ExResponse} \n }, `
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


        }


        let rpl_global = questionAsync('Replacer is global (n)/y: ')
        inner.global = rpl_global.toLowerCase() == 'y' ? true : false

        if (inner.type == 'f' && !inner.global) {
            let rpl_recursive = questionAsync('Function will be recursive,< it will be executed many times > Y/(N) : ')
            inner.recursive = rpl_recursive.toLowerCase() == 'y' ? true : false
        }

        configJson.appendix.push(inner)
        apx = questionAsync('Do you want to add another replacer (N)/Y: ')
    }


    let sh = questionAsync('Do you want to execute a bash command at end (Example: echo "End Process") ')
    if (sh && sh.toLowerCase() != 'n') {
        configJson.cmd = [sh]
    } else {
        configJson.cmd = ''
    }

    functionsFile = functionsFile.replaceAll('{{functions_list}}', function_list)

    fs.writeFileSync(path.resolve(dir, 'functions.js'), functionsFile)
    fs.writeFileSync(path.resolve(dir, 'config.json'), JSON.stringify(configJson, null, '\t'))

    /*
     TODO: reformat using eslint
     l('\t Vamos a revisar el template... \t')
     let {stdout, stderr} = await execAsync('npm i eslint -g');
     if (stderr) {
         l('\t Something occurs when verify template, check it out manually \t')
     }

     let exec_ = await execAsync('eslint -c ' + esLint + ' --fix ' + dir);
     if (exec_.stderr) {
         l('\t Something occurs when verify template, check it out manually \t')
     }*/

    l('\t Template ' + configJson.name + ' created correctly \t')
}


