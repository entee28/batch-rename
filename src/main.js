const { app, BrowserWindow, Menu } = require('electron');
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;
const menu = require('electron').Menu;
const ffi = require('ffi-napi');
const { RuleCreator } = require('./rule-creator');
const path = require('path');
const fs = require('fs');

const isMac = process.platform === 'darwin';

let o1 = new RuleCreator();
o1.invokeTransform('Add prefix', '', 'google');
o1.invokeTransform('Replace characters', '', 'google', 'facebook');

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
          accelerator: "Ctrl+O",
          click() {
            openFile();
          }
        },
        {
          label: "Open Folder...",
          click() {
            openFolder();
          }
        },
        {
          type: 'separator'
        },
        {
          label: "Save Preset",
          accelerator: "Ctrl+S",
          click() {
            savePreset();
          }
        },
        {
          label: "Load Preset",
          accelerator: "Ctrl+L",
          click() {
            loadPreset();
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

ipc.on('save-preset-dialog', function (event) {
  const file = savePreset();
})

const openFile = () => {
  const files = dialog.showOpenDialogSync({ properties: ['openFile', 'multiSelections'] });

  if (!files) { return; }
  return files;
}

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
  return preset;
}

const openFolder = () => {
  const folders = dialog.showOpenDialogSync({ properties: ['openDirectory', 'multiSelections'] });

  if (!folders) { return; }
  return folders;
}

const savePreset = () => {
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
    console.log(file);
    try {
      // Creating and Writing to the preset.json file
      fs.writeFile(file,
        'This is a Sample File', function (err) {
          if (err) throw err;
          console.log('Saved!');
        });
    } catch(err) {
      console.log(err)
    }
  }
}

//DLL DEMO
const libm = ffi.Library(__dirname + '\\DemoDll.dll', {
  'add': ['int', ['int', 'int']]
});
const result = libm.add(2, 3);
console.log(result);