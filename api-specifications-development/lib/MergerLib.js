const ReferenceUpdater = require('./ReferenceUpdater');

module.exports.generateServiceId = function (fileName) {
  return fileName.replace(/\.(ya?ml|json)$/, '').replace(/-?(service)$/i, '');
};

//remove unused definitions, no need generating bloated files
module.exports.resolveApiSpecs = (apiSpec, name) => {
  let hasUnused;
  let runs = 0;
  do {
    console.log(name, ': Unused check... run', ++runs);
    hasUnused = false;
    const refUpdater = new ReferenceUpdater(apiSpec, true);

    apiSpec.definitions = refUpdater.updateReferences(apiSpec.definitions || {});
    apiSpec.responses = refUpdater.updateReferences(apiSpec.responses || {});
    apiSpec.paths = refUpdater.updateReferences(apiSpec.paths || {});
    apiSpec.parameters = refUpdater.updateReferences(apiSpec.parameters || {});

    const keepTypes = apiSpec['x-keep-types'] || [];
    for (let obj in apiSpec.definitions) {
      if (!refUpdater.referencedDefs.has(obj) && !keepTypes.includes(obj)) {
        hasUnused = true;
        delete apiSpec.definitions[obj];
      }
    }
  } while (hasUnused);

  return apiSpec;
};
