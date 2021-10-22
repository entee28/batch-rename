const {AddCounter, AddPrefix, AddSuffix, LowerAll, PascalCase, OnlyOneSpace, ReplaceCharacters, ReplaceExtension} = require('./renaming-rule');

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

module.exports = {
    RuleCreator: RuleCreator
  }