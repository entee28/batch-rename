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

document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();
  
    for (const f of event.dataTransfer.files) {
        // Using the path attribute to get absolute file path
        console.log('File Path of dragged files: ', f.path)
      }
});
  
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
