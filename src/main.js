const { app, BrowserWindow, Menu } = require('electron');
const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;
const { RuleCreator } = require('./rule-creator');
const path = require('path');
const fs = require('fs');
require('electron-reloader')(module);
require('electron').Menu;

const isMac = process.platform === 'darwin';

// let o1 = new RuleCreator();
// console.log(o1.invokeTransform('add-prefix', 'Hello', 'google'));
// console.log(o1.invokeTransform('replace-characters', 'Hello google', 'google', 'facebook'));

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  win.loadFile('src/index.html');

  const template = [
    //File menu
    {
      label: 'File',
      submenu: [
        {
          label: "Open File...",
          accelerator: "Ctrl+O",
          click(event) {
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
    // {
    //   label: 'Edit',
    //   submenu: [
    //     { role: 'undo' },
    //     { role: 'redo' },
    //     { type: 'separator' },
    //     { role: 'cut' },
    //     { role: 'copy' },
    //     { role: 'paste' },
    //     ...(isMac ? [
    //       { role: 'pasteAndMatchStyle' },
    //       { role: 'delete' },
    //       { role: 'selectAll' },
    //       { type: 'separator' },
    //       {
    //         label: 'Speech',
    //         submenu: [
    //           { role: 'startSpeaking' },
    //           { role: 'stopSpeaking' }
    //         ]
    //       }
    //     ] : [
    //       { role: 'delete' },
    //       { type: 'separator' },
    //       { role: 'selectAll' }
    //     ])
    //   ]
    // },

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

ipc.on('save-preset-dialog', function (event, myJSON) {
  const file = savePreset(myJSON);
})

ipc.on('error-handle', function (event, file) {
  dialog.showErrorBox('Error', `Duplicate files detected!`)
})

ipc.on('empty-handle', function (event, file) {
  dialog.showErrorBox('Error', `Empty parameter!`)
})

ipc.on('invalid-handle', function (event, file) {
  dialog.showErrorBox('Error', `Invalid counter parameter!`)
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
  const content = fs.readFileSync(preset[0]).toString(); 
  return content;
}

const openFolder = () => {
  const folders = dialog.showOpenDialogSync({ properties: ['openDirectory', 'multiSelections'] });

  if (!folders) { return; }
  return folders;
}

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