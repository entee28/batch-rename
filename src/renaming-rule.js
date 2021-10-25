const ffi = require('ffi-napi');

const Rules = ffi.Library(__dirname + '\\RenamingRulesLibrary.dll', {
    'AddSuffix': ['string', ['string', 'string']],
    'AddPrefix': ['string', ['string', 'string']],
    'RemoveAllSpace': ['string', ['string']],
    'PascalCase': ['string', ['string']],
    'LowerAll': ['string', ['string']],
    'Replace': ['string', ['string', 'string', 'string']],
});

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

class RemoveAllSpace extends RenamingRule {
    constructor() {
        super();
        this.name = "Only one space";
    }

    Transform(original) {
        return Rules.RemoveAllSpace(original);
    }
}

class ReplaceCharacters extends RenamingRule {
    constructor(needle, replacement) {
        super();
        this.name = "Replace characters";
        this.needle = needle || '-';
        this.replacement = replacement || ' ';
    }

    Transform(original) {
        return Rules.Replace(original, this.needle, this.replacement);
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
        return Rules.Replace(original, this.needle, this.replacement);
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
        return Rules.AddPrefix(original, this.prefix);
    }
}

class AddSuffix extends RenamingRule {
    constructor(suffix) {
        super();
        this.name = "Add suffix";
        this.suffix = suffix;
    }

    Transform(original) {
        return Rules.AddPrefix(original, this.suffix);
    }
}

class LowerAll extends RenamingRule {
    constructor() {
        super();
        this.name = "Convert lowercase";
    }

    Transform(original) {
        return Rules.LowerAll(original);
    }
}

class PascalCase extends RenamingRule {
    constructor() {
        super();
        this.name = "Convert to PascalCase";
    }

    Transform(original) {
        return Rules.PascalCase(original);
    }
}

module.exports = {
    RemoveAllSpace: RemoveAllSpace,
    AddCounter: AddCounter,
    AddPrefix: AddPrefix,
    AddSuffix: AddSuffix,
    ReplaceCharacters: ReplaceCharacters,
    ReplaceExtension: ReplaceExtension,
    PascalCase: PascalCase,
    LowerAll: LowerAll,
}
