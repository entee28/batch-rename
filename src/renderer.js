const path = require('path');
const ipc = require('electron').ipcRenderer;

const openFileBtn = document.getElementById('openFileBtn');
openFileBtn.addEventListener('click', function(event) {
    ipc.send('open-file-dialog')
})

const openFolderBtn = document.getElementById('openFolderBtn');
openFolderBtn.addEventListener('click', function(event) {
    ipc.send('open-folder-dialog')
})

const savePresetBtn = document.getElementById('savePresetBtn');
savePresetBtn.addEventListener('click', function(event) {
    ipc.send('save-preset-dialog')
})

const loadPresetBtn = document.getElementById('loadPresetBtn');
loadPresetBtn.addEventListener('click', function(event) {
    ipc.send('load-preset-dialog')
})

ipc.on('selected-file', function(event, files) {
    const container = document.querySelector("#file-list-container");
    for (let i = 0; i < files.length; i++) {
        const item = document.createElement('li');
        item.textContent = path.basename(files[i]);
        container.appendChild(item);
    }
})

ipc.on('selected-preset', function(event, preset) {
    //received files from main process, need handle
})

ipc.on('selected-folder', function(event, folders) {
    const container = document.querySelector("#file-list-container");
    for (let i = 0; i < folders.length; i++) {
        const item = document.createElement('li');
        item.textContent = path.basename(folders[i]);
        container.appendChild(item);
    }
})

//drag and drop handle
document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
    const container = document.querySelector("#file-list-container");
  
    for (const f of event.dataTransfer.files) {
        const item = document.createElement('li');
        item.textContent = path.basename(f.path); // Using the path attribute to get absolute file path
        container.appendChild(item);
      }
});
  
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
