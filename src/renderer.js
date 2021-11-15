const path = require("path");
const ipc = require("electron").ipcRenderer;
const { RuleCreator } = require("./rule-creator");
window.$ = window.jQuery = require("jquery");
const fs = require("fs");

const pathList = new Array(); //an array of loaded files' path


//Handle open file button click event
const openFileBtn = document.getElementById("openFileBtn");
openFileBtn.addEventListener("click", function (event) {
    ipc.send("open-file-dialog"); //this send an asynchronous message from renderer process to main process
});

//this listen "selected-file" channel, when new files are selected listener would load these files into the program 
ipc.on("selected-file", function (event, files) {
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
});

//Handle open folder button click event
const openFolderBtn = document.getElementById("openFolderBtn");
openFolderBtn.addEventListener("click", function (event) {
    ipc.send("open-folder-dialog");
});

//listener when folders are selected
ipc.on("selected-folder", function (event, folders) {
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
});

//Handle save preset button click event
const savePresetBtn = document.getElementById("savePresetBtn");
savePresetBtn.addEventListener("click", savePreset);
ipc.on('save-preset', savePreset);

function savePreset() {
    const rules = order; //reference to the rule order array
    let factory = new RuleCreator();

    let JSONObj = []; //an array of JSON string, contains every thing we need to recreate a rule
    let JSONStr = null;

    for (let j = 0; j < rules.length; j++) {
        if (rules[j] === "extension") {
            const params = getExtensionParam(); //get rule parameters
            if (params) {
                JSONStr = factory.toJSON(rules[j], params[0], params[1]); //call toJSON function from factory, convert rule to JSON string
                JSONObj.push(JSONStr); //push JSON string into an array
            }
        } else if (rules[j] === "replace-characters") {
            const params = getReplaceParam();
            if (params) {
                JSONStr = factory.toJSON(rules[j], params[0], params[1]);
                JSONObj.push(JSONStr);
            }
        } else if (rules[j] === "add-prefix") {
            const prefix = getPrefixParam();
            if (prefix) {
                JSONStr = factory.toJSON(rules[j], prefix);
                JSONObj.push(JSONStr);
            }
        } else if (rules[j] === "add-suffix") {
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

    JSONStr = JSON.stringify(order); //convert the rule order array to JSON string
    JSONObj.push(JSONStr);

    const myJSON = JSON.stringify(JSONObj); //convert the array of JSON string into a JSON PRESET
    ipc.send("save-preset-dialog", myJSON); //send the JSON PRESET to the main process
}

//Handle save preset button event
const loadPresetBtn = document.getElementById("loadPresetBtn");
loadPresetBtn.addEventListener("click", function (event) {
    ipc.send("load-preset-dialog");
});

//listener when a preset is selected
ipc.on("selected-preset", function (event, preset) {
    const rulePreset = JSON.parse(preset); //parse the JSON PRESET to an array of rules

    for (let i = 0; i < rulePreset.length - 1; i++) {
        const obj = JSON.parse(rulePreset[i]); //parse JSON RULE to a rule object

        if (obj.name === "Remove all space") {
            const cb = document.querySelector('input[id="remove-space"]');
            cb.checked = true;
        } else if (obj.name === "Replace characters") {
            const cb = document.querySelector('input[id="replace-characters"]');
            cb.checked = true;
            const params = document.querySelectorAll(
                `input[name="replace-parameter"]`
            );
            params[0].value = obj.needle;
            params[1].value = obj.replacement;

            params[0].disabled = false;
            params[1].disabled = false;
        } else if (obj.name === "Replace extension") {
            const cb = document.querySelector('input[id="extension"]');
            cb.checked = true;
            const params = document.querySelectorAll(
                `input[name="extension-parameter"]`
            );
            params[0].value = obj.needle;
            params[1].value = obj.replacement;

            params[0].disabled = false;
            params[1].disabled = false;
        } else if (obj.name === "Add prefix") {
            const cb = document.querySelector('input[id="add-prefix"]');
            cb.checked = true;
            const prefix = document.getElementById("prefix");
            prefix.value = obj.prefix;
            prefix.disabled = false;
        } else if (obj.name === "Add suffix") {
            const cb = document.querySelector('input[id="add-suffix"]');
            cb.checked = true;
            const suffix = document.getElementById("suffix");
            suffix.value = obj.suffix;
            suffix.disabled = false;
        } else if (obj.name === "Convert lowercase") {
            const cb = document.querySelector('input[id="lowercase"]');
            cb.checked = true;
        } else if (obj.name === "Convert to PascalCase") {
            const cb = document.querySelector('input[id="pascalcase"]');
            cb.checked = true;
        } else if (obj.name === "Add counter") {
            const cb = document.querySelector('input[id="counter"]');
            cb.checked = true;
            let params = document.querySelectorAll(`input[name="counter-parameter"]`);
            params.forEach((param) => {
                param.disabled = false;
            });
        }
    }

    order = JSON.parse(rulePreset[rulePreset.length - 1]);
    createList();
    addEventListener();
});

//Error handles
const duplicateHandle = (event) => {
    ipc.send("error-handle");
};

const emptyHandle = (event) => {
    ipc.send("empty-handle");
};

const invalidHandle = (event) => {
    ipc.send("invalid-handle");
};

//Drag and drop handle
document.addEventListener("drop", (event) => {
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

document.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.stopPropagation();
});

//Function handle adding files/folders to program
const addFileItem = (__filepath) => {
    pathList.push(__filepath);
    const container = document.querySelector("#file-list-container");
    const item = document.createElement("tr");
    item.setAttribute("path", __filepath);
    item.innerHTML = `
    <td>${path.parse(__filepath).name}</td>
    <td>${path.extname(__filepath)}</td>
    `;
    addDelButton(item);
    container.appendChild(item);
};

//Function handle adding delete button for each loaded file
function addDelButton(parent) {
    const delBtn = parent.appendChild(document.createElement("button"));
    delBtn.classList.add("btn");
    const delIcon = document.createElement("i");
    delIcon.classList.add("fa");
    delIcon.classList.add("fa-trash");
    delBtn.appendChild(delIcon);
    delBtn.onclick = function () {
        const path = this.parentElement.getAttribute("path");
        pathList.splice(pathList.indexOf(path), 1);
        this.parentElement.remove();
    };
}

//function getting parameters for the change extension rule
function getExtensionParam() {
    const params = document.querySelectorAll(`input[name="extension-parameter"]`);
    let values = [];
    try {
        params.forEach((param) => {
            if (param.value === "") {
                throw err;
            }
            values.push(param.value);
        });
        return values;
    } catch (err) {
        emptyHandle();
    }
}

//FUNCTIONS GETTING RULES' PARAMETERS
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
        if (
            parseInt(params[0].value) < 0 ||
            parseInt(params[1].value) < 1 ||
            parseInt(params[2].value) < 1
        ) {
            throw err;
        }
        params.forEach((param) => {
            if (param.value === "") {
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
        const prefix = document.getElementById("prefix");
        if (prefix.value === "") {
            throw err;
        }
        return prefix.value;
    } catch (err) {
        emptyHandle();
    }
}

function getSuffixParam() {
    try {
        const suffix = document.getElementById("suffix");
        if (suffix.value === "") {
            throw err;
        }
        return suffix.value;
    } catch (err) {
        emptyHandle();
    }
}

let order = []; //an array contains rule order

//handle rule selection
[].forEach.call(
    document.querySelectorAll('input[type="checkbox"]'),
    function (checkbox) {
        "use strict";
        checkbox.addEventListener("change", function () {
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

            createList();
            addEventListener();
        });
    }
);


const draggable_list = document.getElementById("draggable-list");
let dragStartIndex;

//SELECTED RULE LIST HANDLE
function createList() {
    draggable_list.innerHTML = "";
    const properNames = convertOrderToName();
    [...properNames].forEach((rule, index) => {
        const listItem = document.createElement("li");

        listItem.setAttribute("data-index", index);
        listItem.innerHTML = `
        <span class="number">${index + 1}</span>
        <div class="draggable" draggable="true">
            <p class="rule-name">${properNames[index]}</p>
            <span class="material-icons">reorder</span>
        </div>
        `;

        draggable_list.appendChild(listItem);
    });
}

//functions handle drag events
function dragStart() {
    dragStartIndex = +this.closest("li").getAttribute("data-index");
    console.log(dragStartIndex);
}
function dragEnter() {
    this.classList.add("over");
}
function dragLeave() {
    this.classList.remove("over");
}
function dragOver(e) {
    e.preventDefault();
}
function dragDrop() {
    const dragEndIndex = +this.getAttribute("data-index");
    swapItems(dragStartIndex, dragEndIndex);

    this.classList.remove("over");
}

function swapItems(fromIndex, toIndex) {
    const itemOne = document.querySelector(`li[data-index='${fromIndex}']`);
    const itemTwo = document.querySelector(`li[data-index='${toIndex}']`);

    const draggableOne = itemOne.querySelector(".draggable");
    const draggableTwo = itemTwo.querySelector(".draggable");

    itemOne.appendChild(draggableTwo);
    itemTwo.appendChild(draggableOne);

    [order[fromIndex], order[toIndex]] = [order[toIndex], order[fromIndex]];
}

//function add drag and drop event to selected rules list
function addEventListener() {
    const draggables = document.querySelectorAll(".draggable");
    const dragListItems = document.querySelectorAll(".draggable-list li");

    draggables.forEach((draggable) => {
        draggable.addEventListener("dragstart", dragStart);
    });

    dragListItems.forEach((item) => {
        item.addEventListener("dragover", dragOver);
        item.addEventListener("drop", dragDrop);
        item.addEventListener("dragenter", dragEnter);
        item.addEventListener("dragleave", dragLeave);
    });
}

//convert button handle
const btn = document.querySelector("#btn");
btn.addEventListener("click", () => {
    const rules = order;
    let factory = new RuleCreator();
    const items = document.querySelectorAll(`li[class="item"]`);

    for (let i = 0; i < pathList.length; i++) {
        let name = path.parse(pathList[i]).name;
        let extension = path.extname(pathList[i]);

        for (let j = 0; j < rules.length; j++) {
            if (rules[j] === "extension") {
                const params = getExtensionParam();
                if (params) {
                    extension = factory.invokeTransform(
                        rules[j],
                        extension,
                        params[0],
                        params[1]
                    );
                }
            } else if (rules[j] === "replace-characters") {
                const params = getReplaceParam();
                if (params) {
                    name = factory.invokeTransform(rules[j], name, params[0], params[1]);
                }
            } else if (rules[j] === "add-prefix") {
                const prefix = getPrefixParam();
                if (prefix) {
                    name = factory.invokeTransform(rules[j], name, prefix);
                }
            } else if (rules[j] === "add-suffix") {
                const suffix = getSuffixParam();
                if (suffix) {
                    name = factory.invokeTransform(rules[j], name, suffix);
                }
            } else if (rules[j] === "counter") {
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

        let newName = path.join(pathList[i], "..", `${name}${extension}`);
        fs.rename(pathList[i], newName, function () {
            pathList[i] = newName;
            items[i].textContent = path.basename(newName);
            addDelButton(items[i]);
        });
    }
});

// ENABLE/DISABLE parameter input boxes when rules' checkbox is CHECKED/UNCHECKED
function EnableDisableSuffixParam() {
    const suffixChk = document.getElementById("add-suffix");
    let suffix = document.getElementById("suffix");
    suffix.disabled = suffixChk.checked ? false : true;
    if (suffix.disabled) {
        suffix.value = "";
    }
}

function EnableDisablePrefixParam() {
    const prefixChk = document.getElementById("add-prefix");
    let prefix = document.getElementById("prefix");
    prefix.disabled = prefixChk.checked ? false : true;
    if (prefix.disabled) {
        prefix.value = "";
    }
}

function EnableDisableExtensionParam() {
    const extensionChk = document.getElementById("extension");
    let params = document.querySelectorAll(`input[name="extension-parameter"]`);
    params.forEach((param) => {
        param.disabled = extensionChk.checked ? false : true;
        if (param.disabled) {
            param.value = "";
        }
    });
}

function EnableDisableReplaceParam() {
    const replaceChk = document.getElementById("replace-characters");
    let params = document.querySelectorAll(`input[name="replace-parameter"]`);
    params.forEach((param) => {
        param.disabled = replaceChk.checked ? false : true;
        if (param.disabled) {
            param.value = "";
        }
    });
}

function EnableDisableCounterParam() {
    const replaceChk = document.getElementById("counter");
    let params = document.querySelectorAll(`input[name="counter-parameter"]`);
    params.forEach((param) => {
        param.disabled = replaceChk.checked ? false : true;
        if (param.disabled) {
            param.value = "";
        }
    });
}

//add click event to rule checkboxes
const suffixCheckBox = document.getElementById("add-suffix");
suffixCheckBox.addEventListener("click", EnableDisableSuffixParam);

const prefixCheckBox = document.getElementById("add-prefix");
prefixCheckBox.addEventListener("click", EnableDisablePrefixParam);

const extensionCheckBox = document.getElementById("extension");
extensionCheckBox.addEventListener("click", EnableDisableExtensionParam);

const replaceCheckBox = document.getElementById("replace-characters");
replaceCheckBox.addEventListener("click", EnableDisableReplaceParam);

const counterCheckBox = document.getElementById("counter");
counterCheckBox.addEventListener("click", EnableDisableCounterParam);


//FUNCTIONS HANDLE SELECT/UNSELECT ALL RULES BUTTON
function check(checked = true) {
    const cbs = document.querySelectorAll('input[type="checkbox"]');
    cbs.forEach((cb) => {
        cb.checked = checked;
    });
}

const selectBtn = document.querySelector("#select");
selectBtn.onclick = checkAll;

function checkAll() {
    check();
    EnableDisableCounterParam();
    EnableDisableExtensionParam();
    EnableDisablePrefixParam();
    EnableDisableReplaceParam();
    EnableDisableSuffixParam();

    // reassign click event handler
    this.onclick = uncheckAll;

    order = getSelectedRules();
    createList();
    addEventListener();
}

function uncheckAll() {
    check(false);
    EnableDisableCounterParam();
    EnableDisableExtensionParam();
    EnableDisablePrefixParam();
    EnableDisableReplaceParam();
    EnableDisableSuffixParam();
    // reassign click event handler
    this.onclick = checkAll;
    order = getSelectedRules();
    createList();
    addEventListener();
}

//function getting rules that are selected
function getSelectedRules() {
    const checkboxes = document.querySelectorAll(
        `input[name="renaming-rules"]:checked`
    );
    let values = [];
    checkboxes.forEach((checkbox) => {
        values.push(checkbox.value);
    });
    return values;
}

//function convert the html rule-checkbox value to proper rule names
function convertOrderToName() {
    let properNames = [];
    for (let i = 0; i < order.length; i++) {
        properNames.push(ruleMap.get(order[i]));
    }

    return properNames;
}

const ruleMap = new Map();
ruleMap.set("extension", "Change File Extension");
ruleMap.set("replace-characters", "Replace Characters");
ruleMap.set("add-prefix", "Add Prefix");
ruleMap.set("add-suffix", "Add Suffix");
ruleMap.set("counter", "Add Counter");
ruleMap.set("remove-space", "Remove All Space");
ruleMap.set("lowercase", "Convert To Lower Case And No Space");
ruleMap.set("pascalcase", "Convert To PascalCase");

function openNav() {
    document.getElementById("sideBar").style.width = "250px";
    document.getElementById("menu").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("sideBar").style.width = "0";
    document.getElementById("menu").style.marginLeft = "0";
}

const openMenu = document.getElementById("open");
const closeMenu = document.getElementById("close");

openMenu.addEventListener("click", openNav);
closeMenu.addEventListener("click", closeNav);
