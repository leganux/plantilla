

const path = require('path')
const fs = require('fs')
const makeDir = require('make-dir');
const { exec } = require("child_process");

const prompt = require('prompt-sync')();


function questionAsync(prompt_) {
    return prompt(prompt_);
}


let copyRecursiveSync = function (src, dest) {
    let exists = fs.existsSync(src);
    let stats = exists && fs.statSync(src);
    let isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(function (childItemName) {
            copyRecursiveSync(path.join(src, childItemName),
                path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
};

const l = async function (message, type) {
    console.log(message);
    return
    switch (type) {
        case 'e':
            console.log(chalk.white.bgRed(message));
            break;

        case 'd':
            console.log(chalk.black.bgYellow(message));
            break;

        case 'l':
            console.log(chalk.white.bgBlack(message));
            break;
        default:
            console.log(chalk.white.bgBlack(message));
            break;
    }
}

module.exports = { copyRecursiveSync, questionAsync, l }