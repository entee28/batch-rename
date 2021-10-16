const ipc = require('electron').ipcRenderer

const openBtn = document.getElementById('openFileBtn');
openBtn.addEventListener('click', function(event) {
    ipc.send('open-file-dialog')
})
