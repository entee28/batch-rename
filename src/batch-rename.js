//ABSTRACT PRODUCT CLASS
class IRenamingRule {
    constructor() {
        if (this.constructor === IRenamingRule) {
            // Abstract class can not be constructed.
            throw new TypeError("Can not construct abstract class.");
        }
        //else (called from child)
        // Check if all instance methods are implemented.
        if (this.Transform === IRenamingRule.prototype.Transform) {
            //Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method Transform.");
        }
    }
    // An abstract method.
    Transform(original) {
        throw new TypeError("Do not call abstract method Transform from child.");
    }
}

class OnlyOneSpace extends IRenamingRule {
    constructor() {
        super();
        this.name = "Only one space";
    }

    Transform(original) {
        console.log(`This is ${this.name} rule!`);
    }
}

class ReplaceCharacters extends IRenamingRule {
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

class ReplaceExtension extends IRenamingRule {
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

class AddCounter extends IRenamingRule {
    constructor(needle, replacement) {
        super();
        this.name = "Add counter";
        this.count = '01';
    }

    Transform(original) {
        console.log(`This is ${this.name} rule!`);
    }
}

class AddPrefix extends IRenamingRule {
    constructor(prefix) {
        super();
        this.name = "Add prefix";
        this.prefix = prefix;
    }

    Transform(original) {
        console.log(`This is ${this.name} rule with needle ${this.prefix}!`);
    }
}

class AddSuffix extends IRenamingRule {
    constructor(suffix) {
        super();
        this.name = "Add suffix";
        this.suffix = suffix;
    }

    Transform(original) {
        console.log(`This is ${this.name} rule with needle ${this.suffix}`);
    }
}

class LowerAll extends IRenamingRule {
    constructor() {
        super();
        this.name = "Convert lowercase";
    }

    Transform(original) {
        console.log(`This is ${this.name} rule!`);
    }
}

class PascalCase extends IRenamingRule {
    constructor() {
        super();
        this.name = "Convert to PascalCase";
    }

    Transform(original) {
        console.log(`This is ${this.name} rule!`);
    }
}

//ABSTRACT CREATOR CLASS
class IRuleCreator {
    constructor() {
        if (this.constructor === IRuleCreator) {
            throw new TypeError("Can not construct abstract class.");
        }
        if (this.createRule === IRuleCreator.prototype.createRule) {
            throw new TypeError("Please implement abstract method createRule.");
        }
    }
    //factory method
    createRule(type, arg1, arg2) {
        throw new TypeError("Do not call abstract method createRule from child.");
    }

    invokeTransform(type, original, arg1, arg2) {
        let rule = this.createRule(type, arg1, arg2);
        rule.Transform(original);
    }
}

class RuleCreator extends IRuleCreator {
    constructor() {
        super();
    }

    createRule(type, arg1, arg2) {
        if(type === 'Only one space') {
            return new OnlyOneSpace();
        } else if(type === 'Replace characters') {
            return new ReplaceCharacters(arg1, arg2);
        } else if (type === 'Replace extension') {
            return new ReplaceExtension(arg1, arg2);
        } else if (type === 'Add prefix') {
            return new AddPrefix(arg1);
        } else if (type === 'Add suffix') {
            return new AddSuffix(arg1);
        } else if (type === 'Convert lowercase') {
            return new LowerAll();
        } else if (type === 'Convert PascalCase') {
            return new PascalCase();
        } else if (type === 'Add counter') {
            return new AddCounter();
        } else return null;
    }
}
let o1 = new RuleCreator();
o1.invokeTransform('Add prefix', '', 'google');