const path = require('path');
const ipc = require('electron').ipcRenderer;
const { RuleCreator } = require('./rule-creator');
window.$ = window.jQuery = require('jquery');
const fs = require('fs');

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

const invalidHandle = (event) => {
    ipc.send('invalid-handle');
}

const openFolderBtn = document.getElementById('openFolderBtn');
openFolderBtn.addEventListener('click', function (event) {
    ipc.send('open-folder-dialog')
})

const savePresetBtn = document.getElementById('savePresetBtn');
savePresetBtn.addEventListener('click', function (event) {
    const rules = order;
    let factory = new RuleCreator();

    let JSONObj = [];
    let JSONStr = null;

    for (let j = 0; j < rules.length; j++) {
        if (rules[j] === 'extension') {
            const params = getExtensionParam();
            if (params) {
                JSONStr = factory.toJSON(rules[j], params[0], params[1]);
                JSONObj.push(JSONStr);
            }
        } else if (rules[j] === 'replace-characters') {
            const params = getReplaceParam();
            if (params) {
                JSONStr = factory.toJSON(rules[j], params[0], params[1]);
                JSONObj.push(JSONStr);
            }
        } else if (rules[j] === 'add-prefix') {
            const prefix = getPrefixParam();
            if (prefix) {
                JSONStr = factory.toJSON(rules[j], prefix);
                JSONObj.push(JSONStr);
            }
        } else if (rules[j] === 'add-suffix') {
            const suffix = getSuffixParam();
            if (suffix) {
                JSONStr = factory.toJSON(rules[j], suffix);
                JSONObj.push(JSONStr);
            }
        } else {
            JSONStr = factory.toJSON(rules[j]);
            JSONObj.push(JSONStr);
        }
    }

    const myJSON = JSON.stringify(JSONObj);
    ipc.send('save-preset-dialog', myJSON);
})

const loadPresetBtn = document.getElementById('loadPresetBtn');
loadPresetBtn.addEventListener('click', function (event) {
    ipc.send('load-preset-dialog')
})

ipc.on('selected-file', function (event, files) {
    try {
        for (let i = 0; i < files.length; i++) {
            for (let j = 0; j < pathList.length; j++) {
                if (files[i] === pathList[j]) {
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
    const rulePreset = JSON.parse(preset);

    for (let i = 0; i < rulePreset.length; i++) {
        const obj = JSON.parse(rulePreset[i]);

        if (obj.name === 'Remove all space') {
            const cb = document.querySelector('input[id="remove-space"]');
            cb.checked = true;
        } else if (obj.name === 'Replace characters') {
            const cb = document.querySelector('input[id="replace-characters"]');
            cb.checked = true;
            const params = document.querySelectorAll(`input[name="replace-parameter"]`);
            params[0].value = obj.needle;
            params[1].value = obj.replacement;

            params[0].disabled = false;
            params[1].disabled = false;
        } else if (obj.name === 'Replace extension') {
            const cb = document.querySelector('input[id="extension"]');
            cb.checked = true;
            const params = document.querySelectorAll(`input[name="extension-parameter"]`);
            params[0].value = obj.needle;
            params[1].value = obj.replacement;

            params[0].disabled = false;
            params[1].disabled = false;
        } else if (obj.name === 'Add prefix') {
            const cb = document.querySelector('input[id="add-prefix"]');
            cb.checked = true;
            const prefix = document.getElementById('prefix');
            prefix.value = obj.prefix;
            prefix.disabled = false;
        } else if (obj.name === 'Add suffix') {
            const cb = document.querySelector('input[id="add-suffix"]');
            cb.checked = true;
            const suffix = document.getElementById('suffix');
            suffix.value = obj.suffix;
            suffix.disabled = false;
        } else if (obj.name === 'Convert lowercase') {
            const cb = document.querySelector('input[id="lowercase"]');
            cb.checked = true;
        } else if (obj.name === 'Convert to PascalCase') {
            const cb = document.querySelector('input[id="pascalcase"]');
            cb.checked = true;
        } else if (obj.name === 'Add counter') {
            const cb = document.querySelector('input[id="counter"]');
            cb.checked = true;
            let params = document.querySelectorAll(`input[name="counter-parameter"]`);
            params.forEach((param) => {
                param.disabled = false;
            });
        }
    }
})

ipc.on('selected-folder', function (event, folders) {
    try {
        for (let i = 0; i < folders.length; i++) {
            for (let j = 0; j < pathList.length; j++) {
                if (folders[i] === pathList[j]) {
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

    try {
        for (const f of event.dataTransfer.files) {
            for (let j = 0; j < pathList.length; j++) {
                if (f.path === pathList[j]) {
                    throw err;
                }
            }
            addFileItem(f.path);
        }
    } catch (err) {
        duplicateHandle();
    }
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

const addFileItem = (__filepath) => {
    pathList.push(__filepath);
    const container = document.querySelector("#file-list-container");
    const item = document.createElement('li');
    item.classList.add('item')
    item.textContent = path.basename(__filepath);
    addDelButton(item, __filepath);
    container.appendChild(item);
}

const pathList = new Array();


function addDelButton(parent, __filepath) {
    const delBtn = parent.appendChild(document.createElement("button"));
    delBtn.classList.add('btn');
    const delIcon = document.createElement('i');
    delIcon.classList.add('fa');
    delIcon.classList.add('fa-trash');
    delBtn.appendChild(delIcon);
    delBtn.onclick = function (__filepath) {
        pathList.splice(pathList.indexOf(__filepath), 1);
        this.parentElement.remove();
    }
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
    params.forEach((param) => {
        values.push(param.value);
    });
    return values;
}

function getCounterParam() {
    const params = document.querySelectorAll(`input[name="counter-parameter"]`);
    let values = [];

    try {
        if (parseInt(params[0].value) < 0 || parseInt(params[1].value) < 1 || parseInt(params[2].value) < 1) {
            throw err;
        }
        params.forEach((param) => {
            if (param.value === '') {
                values.push(1);
            } else {
                values.push(param.value);
            }
        });
        return values;
    } catch (err) {
        invalidHandle();
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

let order = [];
[].forEach.call(document.querySelectorAll('input[type="checkbox"]'), function (checkbox) {
    'use strict';
    checkbox.addEventListener('change', function () {
        let rules = document.querySelectorAll('input[type="checkbox"]');
        let previousLi = checkbox.parentNode.parentNode.previousElementSibling;
        let index = 0;
        while (previousLi !== null) {
            previousLi = previousLi.previousElementSibling;
            index += 1;
        }

        if (checkbox.checked) {
            order.push(rules[index].value);
        } else {
            order.splice(order.indexOf(rules[index].value), 1);
        }

        let result = document.getElementById('result');
        result.textContent = order;
    });
});

const btn = document.querySelector('#btn');
btn.addEventListener('click', () => {
    const rules = order;
    let factory = new RuleCreator();
    const items = document.querySelectorAll(`li[class="item"]`);

    console.log(JSONObj);

    for (let i = 0; i < pathList.length; i++) {

        let name = path.parse(pathList[i]).name;
        let extension = path.extname(pathList[i]);

        for (let j = 0; j < rules.length; j++) {
            if (rules[j] === 'extension') {
                const params = getExtensionParam();
                if (params) {
                    extension = factory.invokeTransform(rules[j], extension, params[0], params[1]);
                }
            } else if (rules[j] === 'replace-characters') {
                const params = getReplaceParam();
                if (params) {
                    name = factory.invokeTransform(rules[j], name, params[0], params[1]);
                }
            } else if (rules[j] === 'add-prefix') {
                const prefix = getPrefixParam();
                if (prefix) {
                    name = factory.invokeTransform(rules[j], name, prefix);
                }
            } else if (rules[j] === 'add-suffix') {
                const suffix = getSuffixParam();
                if (suffix) {
                    name = factory.invokeTransform(rules[j], name, suffix);
                }
            } else if (rules[j] === 'counter') {
                const params = getCounterParam();
                if (params) {
                    let start = parseInt(params[0]);
                    let steps = parseInt(params[1]) * i;
                    let digits = parseInt(params[2]);

                    let padding = start + steps;
                    padding = padding.toString();
                    while (padding.length < digits) padding = "0" + padding;

                    name = factory.invokeTransform(rules[j], name, padding);
                }
            } else {
                name = factory.invokeTransform(rules[j], name);
            }
        }

        let newName = path.join(pathList[i], '..', `${name}${extension}`);
        fs.rename(pathList[i], newName, function () {
            pathList[i] = newName;
            items[i].textContent = path.basename(newName);
            addDelButton(items[i]);
        });
    }
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

function EnableDisableCounterParam() {
    const replaceChk = document.getElementById('counter')
    let params = document.querySelectorAll(`input[name="counter-parameter"]`);
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

const counterCheckBox = document.getElementById('counter');
counterCheckBox.addEventListener('click', EnableDisableCounterParam);