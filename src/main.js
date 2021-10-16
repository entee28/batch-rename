const { app, BrowserWindow } = require('electron');
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })
    win.loadFile('src/index.html');
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function() {
        if(BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
})

app.on('window-all-closed', function() {
    if(process.platform !== 'darwin') {
        app.quit();
    }
})

ipc.on('open-file-dialog', function (event) {
    dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory']
    }, function (files) {
      if (files) event.sender.send('selected-file', files)
    })
  })