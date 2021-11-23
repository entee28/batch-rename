const { app, BrowserWindow, Menu } = require('electron');
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;
const path = require('path');
const fs = require('fs');
require('electron-reloader')(module);
require('electron').Menu;
const electron = require('electron');

//check if program is run on MacOS
const isMac = process.platform === 'darwin';

//create window
app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  win.loadFile('src/index.html'); //load html

  //create app menu
  const template = [
    //File menu
    {
      label: 'File',
      submenu: [
        {
          label: "Open File...",
          accelerator: "Ctrl+O",
          click() {
            const files = openFile();
            if (files) win.webContents.send('selected-file', files)
          }
        },
        {
          label: "Open Folder...",
          click() {
            const folders = openFolder();
            if (folders) win.webContents.send('selected-folder', folders)
          }
        },
        {
          type: 'separator'
        },
        {
          label: "Save Preset",
          accelerator: "Ctrl+S",
          click() {
            win.webContents.send('save-preset');
          }
        },
        {
          label: "Load Preset",
          accelerator: "Ctrl+L",
          click() {
            const preset = loadPreset();
            if (preset) win.webContents.send('selected-preset', preset)
          }
        },
        {
          type: 'separator'
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

    //Help menu
    {
      label: 'Help',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        {
          label: "Documentation",
          click: function() {
            electron.shell.openExternal('https://github.com/entee28/batch-rename-final');
          }
        },
        {
          label: "Get Started",
          click: function() {
            electron.shell.openExternal('https://github.com/entee28/batch-rename-final');
          }
        },
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

//handle closing app behavior on Windows & Linux
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

//Open dialogs when received message from renderer process, then send the selected items back to renderer process 
ipc.on('open-file-dialog', function (event) {
  const files = openFile();
  if (files) event.sender.send('selected-file', files);
})

ipc.on('load-preset-dialog', function (event) {
  const files = loadPreset();
  if (files) event.sender.send('selected-preset', files);
})

ipc.on('open-folder-dialog', function (event) {
  const folders = openFolder();
  if (folders) event.sender.send('selected-folder', folders);
})

ipc.on('save-preset-dialog', function (event, myJSON) {
  const file = savePreset(myJSON);
})

//show error box when received message from renderer process
ipc.on('error-handle', function (event, message) {
  dialog.showErrorBox('Error', `${message}`)
})

//function handle opening file dialog, return an array of selected files
const openFile = () => {
  const files = dialog.showOpenDialogSync({ properties: ['openFile', 'multiSelections'] });

  if (!files) { return; }
  return files;
}

//function opening a JSON preset file, read then return a JSON string
const loadPreset = () => {
  const preset = dialog.showOpenDialogSync({
    title: "Load Existing Preset",
    properties: ['openFile'],
    filters: [
      {
        name: 'JSON file',
        extensions: ['json']
      },],
  });

  if (!preset) { return; }
  const content = fs.readFileSync(preset[0]).toString(); 
  return content;
}

//function handle opening folder dialog, return an array of selected folders
const openFolder = () => {
  const folders = dialog.showOpenDialogSync({ properties: ['openDirectory', 'multiSelections'] });

  if (!folders) { return; }
  return folders;
}

//function handle save preset dialog
const savePreset = (myJSON) => {
  const file = dialog.showSaveDialogSync({
    title: "Save Rule Preset",
    defaultPath: path.join(__dirname, '../assets/preset.json'),
    filters: [
      {
        name: 'JSON file',
        extensions: ['json']
      },],
  });

  if (file) {
    try {
      // Creating and Writing to the preset.json file
      fs.writeFile(file, myJSON, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    } catch (err) {
      console.log(err)
    }
  }
}