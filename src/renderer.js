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
    for (let i = 0; i < files.length; i++) {
        addFileItem(files[i]);
    }
})

ipc.on('selected-preset', function(event, preset) {
    //received files from main process, need handle
})

ipc.on('selected-folder', function(event, folders) {
    for (let i = 0; i < folders.length; i++) {
        addFileItem(folders[i]);
    }
})

//drag and drop handle
document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
  
    for (const f of event.dataTransfer.files) {
        addFileItem(f.path);
      }
});
  
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

const addFileItem = (__filepath) => {
    const container = document.querySelector("#file-list-container");
    const item = document.createElement('li');
    item.textContent = path.basename(__filepath);
    // const button = document.createElement('button');
    // const deleteIcon = document.createElement('i');
    // deleteIcon.classList.add('fas fa-trash-alt');
    // button.appendChild(deleteIcon);
    // item.appendChild(button);
    addDelButton(item);
    container.appendChild(item);
}

function addDelButton(parent) {
    const delBtn = parent.appendChild(document.createElement("button"));
    delBtn.innerHTML = "Delete";
    delBtn.onclick = function() {
        this.parentElement.remove();
    }}