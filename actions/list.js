const {l} = require("../functions");
const listProjects = require("./common/listProjects");


module.exports = async function () {

    let table = listProjects()
    l('********   My Templates  **********')
    console.table(table)
}
