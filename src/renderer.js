const path = require('path');
const ipc = require('electron').ipcRenderer;
const { RuleCreator } = require('./rule-creator');

const openFileBtn = document.getElementById('openFileBtn');
openFileBtn.addEventListener('click', function (event) {
    ipc.send('open-file-dialog')
})

const duplicateHandle = (event) => {
    ipc.send('error-handle');
}

const openFolderBtn = document.getElementById('openFolderBtn');
openFolderBtn.addEventListener('click', function (event) {
    ipc.send('open-folder-dialog')
})

const savePresetBtn = document.getElementById('savePresetBtn');
savePresetBtn.addEventListener('click', function (event) {
    ipc.send('save-preset-dialog')
})

const loadPresetBtn = document.getElementById('loadPresetBtn');
loadPresetBtn.addEventListener('click', function (event) {
    ipc.send('load-preset-dialog')
})

ipc.on('selected-file', function (event, files) {
    try {
        for (let i = 0; i < files.length; i++) {
            for(let j = 0; j < duplicateCheck.length; j++) {
                if(files[i] === duplicateCheck[j]) {
                    throw err;
                }
            }
            addFileItem(files[i]);
        }
    } catch(err) {
        duplicateHandle();
    }
})

ipc.on('selected-preset', function (event, preset) {
    //received files from main process, need handle
})

ipc.on('selected-folder', function (event, folders) {
    try {
        for (let i = 0; i < folders.length; i++) {
            for(let j = 0; j < duplicateCheck.length; j++) {
                if(folders[i] === duplicateCheck[j]) {
                    throw err;
                }
            }
            addFileItem(folders[i]);
        }
    } catch(err) {
        duplicateHandle();
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
    duplicateCheck.push(__filepath);
    const container = document.querySelector("#file-list-container");
    const item = document.createElement('li');
    item.textContent = path.basename(__filepath);
    addDelButton(item);
    container.appendChild(item);
}

const duplicateCheck = new Array();

function addDelButton(parent) {
    const delBtn = parent.appendChild(document.createElement("button"));
    delBtn.classList.add('btn');
    const delIcon = document.createElement('i');
    delIcon.classList.add('fa');
    delIcon.classList.add('fa-trash');
    delBtn.appendChild(delIcon);
    delBtn.onclick = function () {
        this.parentElement.remove();
    }
}

function getSelectedCheckboxValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    let values = [];
    checkboxes.forEach((checkbox) => {
        values.push(checkbox.value);
    });
    return values;
}

const btn = document.querySelector('#btn');
btn.addEventListener('click', (event) => {
    alert(getSelectedCheckboxValues('renaming-rules'));
});