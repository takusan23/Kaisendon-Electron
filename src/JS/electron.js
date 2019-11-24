//ElectronのAPI使ってる
var electron = require('electron').remote

document.getElementById('close_button').addEventListener('click', () => {
    var browser = electron.getCurrentWindow()
    browser.close()
})

document.getElementById('dev_button').addEventListener('click', () => {
    var browser = electron.getCurrentWindow()
    browser.webContents.openDevTools()
})

document.getElementById('account_setting').addEventListener('click', () => {
    electron.getGlobal("accountWindow")()
})

document.getElementById('timeline_add').addEventListener('click', () => {
    electron.getGlobal("addTimelineWindow")()
})

function openBrowser(json, instance) {
    require('electron').shell.openExternal(`https://${instance}/web/statuses/${json.id}`)
}