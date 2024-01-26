const { copyRecursiveSync, questionAsync, l } = require('./../functions')
const path = require('path')
const fs = require('fs')
const makeDir = require('make-dir');
const { exec } = require("child_process");

const os = require("os");

module.exports = async function ({ dir, login, files }) {
    l('Welcome now we gonna configure plantilla engine... \t')

    const userHomeDir = os.homedir();

    let fullpath = path.join(userHomeDir, 'plantilla')
    let configFile = path.join(userHomeDir, '.plantillajs', 'config.js')
    let configFolder = path.join(userHomeDir, '.plantillajs')

    if (!fs.existsSync(configFolder)) {
        await makeDir(configFolder)
    }

    let configJson = require('./../config.json')

    if (!dir) {
        let dir_ = questionAsync('Wich directory save templates (Default:' + fullpath + '): ')
        if (!dir_) {
            dir = fullpath
        } else {
            dir = dir_
        }
    } else {
        dir = dir[0]
    }
    configJson.template_folder = dir



    if (files) {
        l('Adding files to accepted types... \t')
        files = files[0].split(',')
        configJson.files = [...configJson.files, ...files]
        l('Added ' + files.join(','))
    }

    let password = ''
    if (login) {
        l('Trying to login... \t')
        login = login[0]
        password = questionAsync('Insert PK for user  (' + login + '):')
        configJson.credentials.user = login
        configJson.credentials.password = password
        l('User and password configured \t')
    }

    fs.writeFileSync(path.resolve(configFile), JSON.stringify(configJson, null, '\t'))
    l('\t Config file saved correctly \t')
}
