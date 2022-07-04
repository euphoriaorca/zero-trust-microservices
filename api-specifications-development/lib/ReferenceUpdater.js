const _ = require('lodash');

class ReferenceUpdater {
  constructor(root, replaceScalar) {
    this.root = root;
    this.replaceScalar = replaceScalar;
    this.referencedDefs = new Set();
  }

  updateReferences(object) {
    if (typeof object !== 'object') {
      // console.log(`#${prefix} => `, (typeof object));
      return object;
    }

    for (let key in object) {
      if (typeof object[key] === 'object') {
        object[key] = this.updateReferences(object[key]);
      } else if (key === '$ref') {
        let refs = object[key].split('#');
        if (refs[0] && refs[0] !== '_common.yaml') {
          //TODO load remote file
          //TODO extract reference path
          //TODO add reference path to parent.
        }

        object[key] = `#${refs[1]}`;
        //add to referenced definitions
        const modelKey = object[key].split('/').pop();
        if (this.replaceScalar && this.isScalar(modelKey)) {
          delete object[key];
          const modelSpec = this.root.definitions[modelKey];
          object = _.merge({}, object, modelSpec);
        } else {
          //non-scalar, so mark as referenced
          this.referencedDefs.add(modelKey);
        }
      }
    }

    return object;
  }

  isScalar(modelKey) {
    return (
      this.root.definitions.hasOwnProperty(modelKey) &&
      ['integer', 'number', 'string', 'boolean'].includes(this.root.definitions[modelKey].type) &&
      !this.root.definitions[modelKey].enum
    );
  }
}

module.exports = ReferenceUpdater;
