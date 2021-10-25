// const ffi = require('ffi-napi');

// const dll = ffi.Library(__dirname + '\\RenamingRulesDLL.dll', {
//     'AddPrefix': ['string', ['string', 'string']],
//     'AddSuffix': ['string', ['string', 'string']]
// });

// function TEXT(text) {
//     return Buffer.from(`${text}\0`, "ucs2");
// }

// const result = dll.AddPrefix(TEXT("hello"), TEXT("world"));
// console.log(result);


//ABSTRACT PRODUCT CLASS
class RenamingRule {
    constructor() {
        if (this.constructor === RenamingRule) {
            // Abstract class can not be constructed.
            throw new TypeError("Can not construct abstract class.");
        }
        //else (called from child)
        // Check if all instance methods are implemented.
        if (this.Transform === RenamingRule.prototype.Transform) {
            //Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method Transform.");
        }
    }
    // An abstract method.
    Transform(original) {
        throw new TypeError("Do not call abstract method Transform from child.");
    }
}

class OnlyOneSpace extends RenamingRule {
    constructor() {
        super();
        this.name = "Only one space";
    }

    Transform(original) {
        console.log(`This is ${this.name} rule!`);
    }
}

class ReplaceCharacters extends RenamingRule {
    constructor(needle, replacement) {
        super();
        this.name = "Replace characters";
        this.needle = needle || ['-', '_'];
        this.replacement = replacement || ' ';
    }

    Transform(original) {
        console.log(`This is ${this.name} rule with needle ${this.needle}
        and replacement ${this.replacement}!`);
    }
}

class ReplaceExtension extends RenamingRule {
    constructor(needle, replacement) {
        super();
        this.name = "Replace extension";
        this.needle = needle;
        this.replacement = replacement;
    }

    Transform(original) {
        console.log(`This is ${this.name} rule with needle ${this.needle}
        and replacement ${this.replacement}!`);
    }
}

class AddCounter extends RenamingRule {
    constructor(needle, replacement) {
        super();
        this.name = "Add counter";
        this.count = '01';
    }

    Transform(original) {
        console.log(`This is ${this.name} rule!`);
    }
}

class AddPrefix extends RenamingRule {
    constructor(prefix) {
        super();
        this.name = "Add prefix";
        this.prefix = prefix;
    }

    Transform(original) {
        console.log(`This is ${this.name} rule with prefix ${this.prefix}!`);
    }
}

class AddSuffix extends RenamingRule {
    constructor(suffix) {
        super();
        this.name = "Add suffix";
        this.suffix = suffix;
    }

    Transform(original) {
        console.log(`This is ${this.name} rule with suffix ${this.suffix}`);
    }
}

class LowerAll extends RenamingRule {
    constructor() {
        super();
        this.name = "Convert lowercase";
    }

    Transform(original) {
        console.log(`This is ${this.name} rule!`);
    }
}

class PascalCase extends RenamingRule {
    constructor() {
        super();
        this.name = "Convert to PascalCase";
    }

    Transform(original) {
        console.log(`This is ${this.name} rule!`);
    }
}

module.exports = {
    OnlyOneSpace: OnlyOneSpace,
    AddCounter: AddCounter,
    AddPrefix: AddPrefix,
    AddSuffix: AddSuffix,
    ReplaceCharacters: ReplaceCharacters,
    ReplaceExtension: ReplaceExtension,
    PascalCase: PascalCase,
    LowerAll: LowerAll,
}
