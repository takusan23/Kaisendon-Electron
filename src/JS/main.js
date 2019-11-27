// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, nativeTheme, ipcMain } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let accountWindow
let timelineAddWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 900,         //横
        height: 600,        //縦
        frame: false,       //フレームなくす
        transparent: true,
        icon: __dirname + '/../img/icon.png',
        webPreferences: {
            nodeIntegration: true   //これ書く。
        }
    })

    // and load the index.html of the app.
    mainWindow.loadFile('./src/index.html')
    //メニューバー削除
    Menu.setApplicationMenu(null)

    // Open the DevTools.
    //  mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

function createSettingWindow() {
    // Create the browser window.
    accountWindow = new BrowserWindow({
        width: 900,         //横
        height: 600,        //縦
        webPreferences: {
            nodeIntegration: true   //これ書く。
        }
    })

    // and load the index.html of the app.
    accountWindow.loadFile('./src/html/account_settings.html')
    //メニューバー削除
    Menu.setApplicationMenu(null)

    // Open the DevTools.
    //accountWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    accountWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        accountWindow = null
    })
}

function createTimelineAddWindow() {
    // Create the browser window.
    addTimelineWindow = new BrowserWindow({
        width: 900,         //横
        height: 600,        //縦
        frame: false,       //フレームなくす
        webPreferences: {
            nodeIntegration: true   //これ書く。
        }
    })
    // and load the index.html of the app.
    addTimelineWindow.loadFile('./src/html/timeline_add.html')
    //メニューバー削除
    Menu.setApplicationMenu(null)

    // Open the DevTools.
    //addTimelineWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    addTimelineWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        addTimelineWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow()

    nativeTheme.themeSource = 'system';


})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


//アカウント設定画面開く
global.accountWindow = function () {
    createSettingWindow()
};

//タイムライン追加画面出す
global.addTimelineWindow = function () {
    createTimelineAddWindow()
};



// // In main process.
// // IPC通信
// ipcMain.on('ipc', (event, arg) => {
//     switch (arg) {
//         case "setting_open":
//             mainWindow.loadFile('./src/html/settings.html')
//             break;
//         case "setting_close":
//             mainWindow.loadFile('./src/index.html')
//             break;
//     }
// })
