const {copyRecursiveSync, questionAsync, l} = require('./../functions')
const path = require('path')
const fs = require('fs')
const makeDir = require('make-dir');
const {exec} = require("child_process");
const downloadFile = require('./common/downloader')
const AdmZip = require('adm-zip');
const os = require("os");
const {promisify} = require("util");
const listProjects = require("./common/listProjects");

const execAsync = promisify(exec);

const list_of_starter_templates = [
    'https://github.com/leganux/nucleus_starter_templates/archive/refs/heads/main.zip'
]
const list_of_starter_templates_folders = [
    'nucleus_starter_templates-main'
]

let sleepSetTimeout_ctrl;

function sleep(ms) {
    clearInterval(sleepSetTimeout_ctrl);
    return new Promise(resolve => sleepSetTimeout_ctrl = setTimeout(resolve, ms));
}

function getDirectories(dirPath) {
    // Lee el contenido del directorio
    const contents = fs.readdirSync(dirPath);

    // Filtra solo los directorios
    const directories = contents.filter(item => {
        // Obtiene la ruta completa del elemento
        const itemPath = path.join(dirPath, item);
        // Verifica si el elemento es un directorio
        return fs.statSync(itemPath).isDirectory();
    });

    return directories;
}

module.exports = async function ({dir, login, files}) {
    l('Welcome now we gonna configure nucleus engine... \t')

    const userHomeDir = os.homedir();

    let fullpath = path.join(userHomeDir, 'nucleus')
    let configFile = path.join(userHomeDir, '.nucleusjs', 'config.js')
    let packageJson = path.join(userHomeDir, '.nucleusjs', 'package.json')

    let configFolder = path.join(userHomeDir, '.nucleusjs')

    if (!fs.existsSync(configFolder)) {
        await makeDir(configFolder)
    }

    let configJson = require('./../config.json')
    let packageJson_source = require('./../package_example.json')

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

    await sleep(500)

    if (!fs.existsSync(dir)) {
        l('\t Folder doesn`t not exists. Creating... \t')
        await makeDir(dir)
    }

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

    await sleep(500)
    l('\t Installing starter templates... \t')

    for (let item of list_of_starter_templates) {
        l('\t Reaching... ' + item + ' \t')

        await sleep(500)
        await downloadFile(item, path.resolve(dir, 'main.zip'))
        await sleep(500)

        l('\t unzip...  \t')

        const zip = new AdmZip(path.join(dir, 'main.zip'));
        try {
            zip.extractAllTo(path.join(dir), true);

            l('\t Unzip complete \t')
        } catch (error) {
            console.error('Unzip failed:', error.message);
        }
    }
    for (let item of list_of_starter_templates_folders) {
        if (fs.existsSync(path.join(dir, item))) {

            let directories_new = getDirectories(path.join(dir, item))
            for (let jtem of directories_new) {
                l('\t moving files....  ' + path.join(dir, item, jtem) + ' -> ' + dir + ' \t')
                if (!fs.existsSync(path.join(dir, jtem))) {
                    let {
                        stdout,
                        stderr
                    } = await execAsync(`mv -f ${path.join(dir, item, jtem)}/  ${path.join(dir, jtem)}`);
                    try {

                        console.log('Command executed:');
                        console.log('stdout:', stdout);
                        console.error('stderr:', stderr);
                    } catch (e) {
                        console.error('error executing command ' + item + ':', e);
                    }
                    l('\t moved  ' + path.join(dir, item, jtem) + ' -> ' + dir + ' \t')

                }

            }


            l('\t delete  folder....  ' + path.join(dir, item) + ' \t')
            try {
                const {stdout, stderr} = await execAsync(`rm -rf ${path.join(dir, item)}`);
                console.log('Command executed:');
                console.log('stdout:', stdout);
                //console.error('stderr:', stderr);
            } catch (e) {
                console.error('error executing command ' + item + ':', e);
            }
            l('\t deleted  ' + path.join(dir, item) + ' \t')
        }

    }

    if (fs.existsSync(path.join(dir, 'main.zip'))) {
        fs.unlinkSync(path.join(dir, 'main.zip'))
    }
    if (fs.existsSync(path.join(dir, 'LICENSE'))) {
        fs.unlinkSync(path.join(dir, 'LICENSE'))
    }
    if (fs.existsSync(path.join(dir, 'README.md'))) {
        fs.unlinkSync(path.join(dir, 'README.md'))
    }


    fs.writeFileSync(path.resolve(configFile), JSON.stringify(configJson, null, '\t'))
    fs.writeFileSync(path.resolve(packageJson), JSON.stringify(packageJson_source, null, '\t'))







    let table = listProjects()
    l('********   My Templates  **********')
    console.table(table)


    l('\n\n\n')
    l('\t Config file saved correctly \t')
}
