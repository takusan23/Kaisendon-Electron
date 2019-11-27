//ElectronのAPI使ってる
var electron = require('electron').remote
const { ipcRenderer } = require('electron')

document.getElementById('close_button').addEventListener('click', () => {
    var browser = electron.getCurrentWindow()
    browser.close()
})

document.getElementById('dev_button').addEventListener('click', () => {
    var browser = electron.getCurrentWindow()
    browser.webContents.openDevTools()
})


function openBrowser(json, instance) {
    require('electron').shell.openExternal(`https://${instance}/web/statuses/${json.id}`)
}
