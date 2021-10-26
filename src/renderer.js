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

const emptyHandle = (event) => {
    ipc.send('empty-handle');
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
            for (let j = 0; j < duplicateCheck.length; j++) {
                if (files[i] === duplicateCheck[j]) {
                    throw err;
                }
            }
            addFileItem(files[i]);
        }
    } catch (err) {
        duplicateHandle();
    }
})

ipc.on('selected-preset', function (event, preset) {
    //received files from main process, need handle
})

ipc.on('selected-folder', function (event, folders) {
    try {
        for (let i = 0; i < folders.length; i++) {
            for (let j = 0; j < duplicateCheck.length; j++) {
                if (folders[i] === duplicateCheck[j]) {
                    throw err;
                }
            }
            addFileItem(folders[i]);
        }
    } catch (err) {
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

function getSelectedRules() {
    const checkboxes = document.querySelectorAll(`input[name="renaming-rules"]:checked`);
    let values = [];
    checkboxes.forEach((checkbox) => {
        values.push(checkbox.value);
    });
    return values;
}

function getExtensionParam() {
    const params = document.querySelectorAll(`input[name="extension-parameter"]`);
    let values = [];
    try {
        params.forEach((param) => {
            if (param.value === '') {
                throw err;
            }
            values.push(param.value);
        });
        return values;

    } catch (err) {
        emptyHandle();
    }
}

function getReplaceParam() {
    const params = document.querySelectorAll(`input[name="replace-parameter"]`);
    let values = [];
    try {
        params.forEach((param) => {
            if (param.value === '') {
                throw err;
            }
            values.push(param.value);
        });
        return values;
    } catch (err) {
        emptyHandle();
    }
}

function getPrefixParam() {
    try {
        const prefix = document.getElementById('prefix');
        if (prefix.value === '') {
            throw err;
        }
        return prefix.value;
    } catch (err) {
        emptyHandle();
    }
}

function getSuffixParam() {
    try {
        const suffix = document.getElementById('suffix');
        if (suffix.value === '') {
            throw err;
        }
        return suffix.value;
    } catch (err) {
        emptyHandle();
    }
}

const btn = document.querySelector('#btn');
btn.addEventListener('click', (event) => {
    const rules = getSelectedRules();
    let factory = new RuleCreator();
    let string = "hello world"

    for (let i = 0; i < rules.length; i++) {
        if (rules[i] === 'extension') {
            const params = getExtensionParam();
            if (params) {
                string = factory.invokeTransform(rules[i], string, params[0], params[1]);
            }
        } else if (rules[i] === 'replace-characters') {
            const params = getReplaceParam();
            if (params) {
                string = factory.invokeTransform(rules[i], string, params[0], params[1]);
            }
        } else if (rules[i] === 'add-prefix') {
            const prefix = getPrefixParam();
            if (prefix) {
                string = factory.invokeTransform(rules[i], string, prefix);
            }
        } else if (rules[i] === 'add-suffix') {
            const suffix = getSuffixParam();
            if (suffix) {
                string = factory.invokeTransform(rules[i], string, suffix);
            }
        } else {
            string = factory.invokeTransform(rules[i], string);
        }
    }

    console.log(string);
});

function EnableDisableSuffixParam() {
    const suffixChk = document.getElementById('add-suffix')
    let suffix = document.getElementById('suffix');
    suffix.disabled = suffixChk.checked ? false : true;
    if (suffix.disabled) {
        suffix.value = '';
    }
}

function EnableDisablePrefixParam() {
    const prefixChk = document.getElementById('add-prefix')
    let prefix = document.getElementById('prefix');
    prefix.disabled = prefixChk.checked ? false : true;
    if (prefix.disabled) {
        prefix.value = '';
    }
}

function EnableDisableExtensionParam() {
    const extensionChk = document.getElementById('extension')
    let params = document.querySelectorAll(`input[name="extension-parameter"]`);
    params.forEach((param) => {
        param.disabled = extensionChk.checked ? false : true;
        if (param.disabled) {
            param.value = '';
        }
    });
}

function EnableDisableReplaceParam() {
    const replaceChk = document.getElementById('replace-characters')
    let params = document.querySelectorAll(`input[name="replace-parameter"]`);
    params.forEach((param) => {
        param.disabled = replaceChk.checked ? false : true;
        if (param.disabled) {
            param.value = '';
        }
    });
}

const suffixCheckBox = document.getElementById('add-suffix');
suffixCheckBox.addEventListener('click', EnableDisableSuffixParam);

const prefixCheckBox = document.getElementById('add-prefix');
prefixCheckBox.addEventListener('click', EnableDisablePrefixParam);

const extensionCheckBox = document.getElementById('extension');
extensionCheckBox.addEventListener('click', EnableDisableExtensionParam);

const replaceCheckBox = document.getElementById('replace-characters');
replaceCheckBox.addEventListener('click', EnableDisableReplaceParam);