const os = require("os");
const {l} = require("../../functions");
const path = require("path");
const fs = require("fs");

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

module.exports = function () {
    const userHomeDir = os.homedir();

    l('Welcome we gonna execute template... \t')

    let configFile = path.join(userHomeDir, '.nucleusjs', 'config.js')
    if (!fs.existsSync(configFile)) {
        l('We can not find config file, please execute "configure" comand please  \t')
        return
    }
    let configJson = fs.readFileSync(configFile, {encoding: 'utf8', flag: 'r'})
    configJson = JSON.parse(configJson)

    let nucleussPath = configJson.template_folder
    const directories = getDirectories(path.join(nucleussPath))

    let table = []
    for (let item of directories) {
        let pathFull = path.join(nucleussPath, item)
        let pathFull_json = path.join(nucleussPath, item, 'config.json')
        if (fs.existsSync(pathFull) && fs.existsSync(pathFull_json)) {
            let innerConfig = fs.readFileSync(pathFull_json, {encoding: 'utf8', flag: 'r'})
            innerConfig = JSON.parse(innerConfig)
            table.push({
                name: item,
                description: innerConfig.description || null,
                version: innerConfig.version || null,
                overwrite: innerConfig.overwrite || false,
                cmd: innerConfig?.cmd.join(', ') || false,
            })
        }
    }

    return table

}
