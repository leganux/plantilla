const {copyRecursiveSync, questionAsync, l} = require('./../functions')
const path = require('path')
const fs = require('fs')
const makeDir = require('make-dir');
const {exec} = require("child_process");
const {promisify} = require('util');
const os = require("os");
const v = require("voca");
const moment = require("moment");
const listProjects = require("./common/listProjects");
const execAsync = promisify(exec);

let sleepSetTimeout_ctrl;

function sleep(ms) {
    clearInterval(sleepSetTimeout_ctrl);
    return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms));
}

let getThree = function (src, three) {
    if (!three) {
        three = [];
    }

    let exists = fs.existsSync(src);
    let stats = exists && fs.statSync(src);
    let isDirectory = exists && stats.isDirectory();

    if (isDirectory) {
        three.push(src);
        let files = fs.readdirSync(src);
        files.forEach(function (childItemName) {
            let childItemPath = path.join(src, childItemName);
            getThree(childItemPath, three); // Recursivamente llamamos la función para cada elemento en el directorio
        });
    } else {
        three.push(src);
    }
    return three;
};

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
    const userHomeDir = os.homedir();

    l('Welcome we gonna execute template... \t')

    let configFile = path.join(userHomeDir, '.plantillajs', 'config.js')
    if (!fs.existsSync(configFile)) {
        l('We can not find config file, please execute "configure" comand please  \t')
        return
    }
    let configJson = fs.readFileSync(configFile, {encoding: 'utf8', flag: 'r'})
    configJson = JSON.parse(configJson)

    let plantillasPath = configJson.template_folder


    let table = listProjects()
    l('********   My Templates  **********')
    console.table(table)


    if (!name) {
        name = questionAsync('Give me the template name: ')
    } else {
        name = name[0]
    }

    l('Welcome searching template... \t')

    name = name.replaceAll(' ', '_')

    let pathTemplate = path.join(plantillasPath, name)
    if (!fs.existsSync(pathTemplate)) {
        l('We can not find template, be sure template exists, ' + path.join(plantillasPath, name) + '  \t')
        return
    }

    let pathTemplateConfig = path.join(plantillasPath, name, 'config.json')

    if (!fs.existsSync(pathTemplateConfig)) {
        l('We can not find template config json, be sure template exists  \t')
        return
    }
    let actualPath = path.resolve('.')
    l('We execute in actual path ' + actualPath)

    let conf = fs.readFileSync(pathTemplateConfig, {encoding: 'utf8', flag: 'r'})

    conf = JSON.parse(conf)
    let pathFunctions = path.join(plantillasPath, name, conf.functions_file)
    let exec_functions = require(pathFunctions)
    let source = path.join(plantillasPath, name, 'structure')
    let destination = actualPath
    let supportedFiles = conf.support_files
    let overwrite = conf.overwrite
    let cmd = conf.cmd

    try {
        process.chdir(path.join(plantillasPath, name));
        const {stdout, stderr} = await execAsync('npm i');
        console.log('Command executed:');
        console.log('stdout:', stdout);
    } catch (e) {

    }


    l('Lets configure globals for replacers')

    let replacerObject = {
        n: {},
        f: {},
        v: {},
    }
    if (conf.replacer) {
        for (let item of conf.replacer) {

            if (item.global) {
                let value
                if (item.ask && (item.type == 'n' || item.type == 'v')) {
                    value = questionAsync('>' + item.ask + '  ')
                    item.value = value
                } else {
                    value = questionAsync('> Give me the value for' + item.ask + ':  ')
                    item.value = value
                }
                if (item.type == 'function' && item.params.length > 0) {
                    let obj_params = {}
                    for (let jtem of item.params) {
                        value = questionAsync('> In function ' + item.name + ' give me the value for' + jtem + ':  ')
                        obj_params[jtem] = value
                    }
                    item.function_values = obj_params
                }
            }

            if (item.type == 'n') {
                item.find = conf?.match?.function?.replace('X', item.name)
            }
            if (item.type == 'v') {
                item.find = conf?.match?.variable?.replace('X', item.name)
            }
            if (item.type == 'n') {
                item.find = conf?.match?.files?.replace('X', item.name)
            }

            replacerObject[item.type][item.name] = item
        }
    }


    l('Lets configure globals for appendix')

    let appendixObject = {
        n: {},
        f: {},
        v: {},
    }

    if (conf.appendix) {
        for (let item of conf.appendix) {
            if (item.global) {
                let value
                if (item.ask && (item.type == 'n' || item.type == 'v')) {
                    value = questionAsync('>' + item.ask + '  ')
                    item.value = value
                } else {
                    value = questionAsync('> Give me the value for' + item.ask + ' ')
                    item.value = value
                }
                if (item.type == 'function' && item.params.length > 0) {
                    let obj_params = {}
                    for (let jtem of item.params) {
                        value = questionAsync('> In function ' + item.name + ' give me the value for' + jtem + ': ')
                        obj_params[jtem] = value
                    }
                    item.function_values = obj_params
                }
            }

            if (item.type == 'n') {
                item.find = conf?.match?.function?.replace('X', item.name)
            }
            if (item.type == 'v') {
                item.find = conf?.match?.variable?.replace('X', item.name)
            }
            if (item.type == 'n') {
                item.find = conf?.match?.files?.replace('X', item.name)
            }

            appendixObject[item.type][item.name] = item
        }
    }


    console.log('replacerObject', replacerObject)
    console.log('appendixObject', appendixObject)
    console.log('destination', destination)
    console.log('source', source)

    l('Reading source three')
    await sleep(1000)
    let three = getThree(source)


    l('Starting  proccess ' + three.length + ' files..')
    await sleep(1000)

    for (let item of three) {
        l('File ' + item)
        await sleep(30)

        let newPath = item.replaceAll(source, destination)

        if (newPath.includes('___')) {
            if (replacerObject.n) {
                for (let [key, val] of Object.entries(replacerObject.n)) {
                    if (newPath.includes(val.find)) {
                        let valueN = ''
                        if (val.global) {
                            valueN = val.value
                        } else {
                            valueN = questionAsync((val.ask && val.ask != '') ? val.ask : '> Give me the value for file name ' + key + ': ')
                        }
                        newPath = newPath.replaceAll(val.find, valueN)
                    }
                }
            }
        }
        console.log(newPath)

        if (fs.lstatSync(item).isDirectory()) {
            //es directorio
            await makeDir(newPath)
        } else {
            //no es directorio
            let ext = newPath.split('.')[newPath.split('.').length - 1]
            console.log('extension', ext)
            if (supportedFiles.includes(ext)) {
                console.log('valid')
                if ((fs.existsSync(newPath) && conf.overwrite) || !fs.existsSync(newPath)) {
                    try {
                        let fileContent = fs.readFileSync(item, 'utf-8');
                        // replacers varaibles
                        for (let [key, val] of Object.entries(replacerObject?.v)) {
                            if (fileContent.includes(val.find)) {
                                let newVal = ''
                                if (val.global) {
                                    newVal = val.value
                                } else {
                                    newVal = questionAsync((val.ask && val.ask != '') ? val.ask : '> Give me the value for variable ' + key + ': ')
                                }
                                fileContent = fileContent.replaceAll(val.find, newVal)
                            }
                        }
                        // replacers functions
                        for (let [key, val] of Object.entries(replacerObject?.f)) {
                            if (fileContent.includes(val.find)) {
                                let newVal = {}
                                if (val.global) {
                                    newVal = exec_functions[val.name](val.function_values)
                                    console.log(newVal.message)
                                    if (newVal.success) {
                                        fileContent = fileContent.replaceAll(val.find, newVal.template)
                                    }
                                } else {


                                    let ex_func = questionAsync('>You wanna execute function ' + key + ' to add values y/(n) :  ')
                                    let arrData = []
                                    while (ex_func.toLowerCase() == 'y') {

                                        let obj_params = {}
                                        for (let ktem of val.params) {
                                            let myvalue = questionAsync('> In function ' + key + ' give me the value for' + ktem + ':  ')
                                            obj_params[ktem] = myvalue
                                        }

                                        newVal = exec_functions[val.name](obj_params)

                                        console.log(newVal.message)
                                        if (newVal.success) {
                                            arrData.push(newVal.template)
                                        }


                                        ex_func = questionAsync('>You wanna execute function ' + key + ' again to add new  values y/(n) :  ')
                                    }
                                    if (arrData.length > 0) {
                                        fileContent = fileContent.replaceAll(val.find, arrData.join(' '))
                                    }


                                }

                            }
                        }


                        // appenddicers varaibles
                        for (let [key, val] of Object.entries(appendixObject?.v)) {
                            if (fileContent.includes(val.match) && item.includes(val.dir)) {
                                let newVal = ''
                                if (val.global) {
                                    newVal = val.value
                                } else {
                                    newVal = questionAsync((val.ask && val.ask != '') ? val.ask : '> Give me the value for variable appendix ' + key + ': ')
                                }
                                if (val.position == 'before') {
                                    fileContent = fileContent.replaceAll(val.match, val.match + '\n' + newVal)
                                } else {
                                    fileContent = fileContent.replaceAll(val.match, newVal, '\n' + val.match)
                                }

                            }
                        }
                        // appenddicers functions
                        for (let [key, val] of Object.entries(appendixObject?.f)) {
                            if (fileContent.includes(val.match) && item.includes(val.dir)) {

                                let newVal = {}
                                if (val.global) {
                                    newVal = exec_functions[val.name](val.function_values)
                                    console.log(newVal.message)
                                    if (newVal.success) {

                                        if (val.position == 'before') {
                                            fileContent = fileContent.replaceAll(val.match, val.match + '\n' + newVal.template)
                                        } else {
                                            fileContent = fileContent.replaceAll(val.match, newVal.template, '\n' + val.match)
                                        }

                                    }
                                } else {
                                    let ex_func = questionAsync('>You wanna execute function ' + key + ' to add values y/(n) :  ')

                                    while (ex_func.toLowerCase() == 'y') {

                                        let obj_params = {}
                                        for (let ktem of val.params) {
                                            let myvalue = questionAsync('> In function ' + key + ' give me the value for appendix ' + ktem + ':  ')
                                            obj_params[ktem] = myvalue
                                        }

                                        newVal = exec_functions[val.name](obj_params)
                                        console.log(newVal.message)
                                        if (newVal.success) {

                                            if (val.position == 'before') {
                                                fileContent = fileContent.replaceAll(val.match, val.match + '\n' + newVal.template)
                                            } else {
                                                fileContent = fileContent.replaceAll(val.match, newVal.template, '\n' + val.match)
                                            }

                                        }

                                        ex_func = questionAsync('>You wanna execute function ' + key + ' again to add new values y/(n) :  ')
                                    }


                                }


                            }
                        }


                        fs.writeFileSync(newPath, fileContent, 'utf-8');
                    } catch (e) {
                        console.error('Error al mover el archivo', e, ' Continue....')
                    }
                }
            } else {
                console.log('not_valid')
                if (fs.existsSync(newPath)) {
                    if (overwrite) {
                        console.log('overwited')
                        fs.copyFileSync(item, newPath);
                    }
                } else {
                    console.log('copied')
                    fs.copyFileSync(item, newPath);
                }
            }
        }


    }


    l('End  proccess ' + three.length + ' files processed..')


    process.chdir(destination);
    for (let item of cmd) {
        try {
            const {stdout, stderr} = await execAsync(item);
            console.log('Command executed:');
            console.log('stdout:', stdout);
            console.error('stderr:', stderr);
        } catch (e) {
            console.error('error executing command ' + item + ':', e);
        }

    }


}
