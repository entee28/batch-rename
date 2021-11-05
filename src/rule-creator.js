const {AddCounter, AddPrefix, AddSuffix, LowerAll, PascalCase, RemoveAllSpace, ReplaceCharacters, ReplaceExtension} = require('./renaming-rule');

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
        return rule.Transform(original);
    }

    toJSON(type, arg1, arg2) {
        let rule = this.createRule(type, arg1, arg2);
        return JSON.stringify(rule);
    }
}

class RuleCreator extends IRuleCreator {
    constructor() {
        super();
    }

    createRule(type, arg1, arg2) {
        if(type === 'remove-space') {
            return new RemoveAllSpace();
        } else if(type === 'replace-characters') {
            return new ReplaceCharacters(arg1, arg2);
        } else if (type === 'extension') {
            return new ReplaceExtension(arg1, arg2);
        } else if (type === 'add-prefix') {
            return new AddPrefix(arg1);
        } else if (type === 'add-suffix') {
            return new AddSuffix(arg1);
        } else if (type === 'lowercase') {
            return new LowerAll();
        } else if (type === 'pascalcase') {
            return new PascalCase();
        } else if (type === 'counter') {
            return new AddCounter(arg1);
        } else return null;
    }
}

module.exports = {
    RuleCreator: RuleCreator
  }