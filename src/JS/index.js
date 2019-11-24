//ブラウザーのJS
//これはElectronのAPI使ってない。
window.onload = function () {
    document.getElementById('close_button').style.display = 'none'
    document.getElementById('dev_button').style.display = 'none'
}

document.getElementById('account_setting').onclick = () => {
    window.open('html/account_settings.html')
}

document.getElementById('timeline_add').onclick = () => {
    window.open('html/timeline_add.html')
}
function openBrowser(json, instance) {
    window.open(`https://${instance}/web/statuses/${json.id}`)
}