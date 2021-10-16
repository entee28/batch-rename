const { app, BrowserWindow, Menu } = require('electron');
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog
const meny = require('electron').Menu

const isMac = process.platform === 'darwin'

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    win.loadFile('src/index.html');
    // win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    const template = [
        //File menu
        {
            label: 'File',
            submenu: [
                {
                    label: "Open File...",
                    click: function () {
                        dialog.showOpenDialog({
                            properties: ['openFile', "multiSelections"]
                        })
                    }
                },
                {
                    label: "Open Folder...",
                    click: () => {
                        dialog.showOpenDialog({
                            properties: ['openDirectory', "multiSelections"]
                        })
                    }
                },
                isMac ? { role: 'close' } : { role: 'quit' },
            ]
        },
        
        //Edit menu
        {
            label: 'Edit',
            submenu: [
              { role: 'undo' },
              { role: 'redo' },
              { type: 'separator' },
              { role: 'cut' },
              { role: 'copy' },
              { role: 'paste' },
              ...(isMac ? [
                { role: 'pasteAndMatchStyle' },
                { role: 'delete' },
                { role: 'selectAll' },
                { type: 'separator' },
                {
                  label: 'Speech',
                  submenu: [
                    { role: 'startSpeaking' },
                    { role: 'stopSpeaking' }
                  ]
                }
              ] : [
                { role: 'delete' },
                { type: 'separator' },
                { role: 'selectAll' }
              ])
            ]
          },

          //View menu
          {
            label: 'View',
            submenu: [
              { role: 'reload' },
              { role: 'forceReload' },
              { role: 'toggleDevTools' },
              { type: 'separator' },
              { role: 'resetZoom' },
              { role: 'zoomIn' },
              { role: 'zoomOut' },
              { type: 'separator' },
              { role: 'togglefullscreen' }
            ]
          },

          //Window menu
          {
            label: 'Window',
            submenu: [
              { role: 'minimize' },
              { role: 'zoom' },
              ...(isMac ? [
                { type: 'separator' },
                { role: 'front' },
                { type: 'separator' },
                { role: 'window' }
              ] : [
                { role: 'close' }
              ])
            ]
          },
    ]

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})

ipc.on('open-file-dialog', function (event) {
    dialog.showOpenDialog({
        properties: ['openFile', "multiSelections"]
    }, function (files) {
        if (files) event.sender.send('selected-file', files)
    })
})