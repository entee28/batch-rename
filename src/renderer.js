const ipc = require('electron').ipcRenderer

const openFileBtn = document.getElementById('openFileBtn');
openFileBtn.addEventListener('click', function(event) {
    ipc.send('open-file-dialog')
})

const openFolderBtn = document.getElementById('openFolderBtn');
openFolderBtn.addEventListener('click', function(event) {
    ipc.send('open-folder-dialog')
})

ipc.on('selected-file', function(event, files) {
    //received files from main process, need handle
})

ipc.on('selected-folder', function(event, folders) {
    //received files from main process, need handle
})
