const { ipcRenderer } = require('electron')

//IPCつうしん
document.getElementById('close').onclick = () => {
    // In renderer process (web page).
    ipcRenderer.send('ipc', 'setting_close')
}