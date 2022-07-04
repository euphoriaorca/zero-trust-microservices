const _ = require('lodash');

const METHODS = ['get', 'post', 'put', 'delete', 'options', 'patch', 'head'];
const GATEWAY_API_VERSION = '1.0';

const baseObject = {
  info: {
    version: GATEWAY_API_VERSION, //version bump
    title: 'DistinctAI Internal API',
    description: `**Introduction**
      See documentation for what applies to teh endpoint you want to access.

      **Errors**
      Uses conventional HTTP response codes to indicate success or failure. In
      general, codes in the \`2xx\` range indicate success. Codes in the \`4xx\` range
      indicate an error (e.g. required parameters, failed request etc.). Codes int
      he \`5xx\` range indicate a server error occurred.`,
    contact: {
      name: 'Distinct',
      email: 'developers@distinct.ai',
    },
    license: {
      name: 'UNLICENSED',
      url: 'https://distinctai.com/terms/LICENSE.html',
    },
  },

  basePath: '/',
  schemes: ['https'],
  host: 'staging-api.distinct.ai',
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const selectPathsFromService = (serviceId, specs) => {
  const outObject = {};

  for (let path in specs.paths) {
    if (!specs.paths.hasOwnProperty(path)) {
      return;
    }

    //TODO resolve $ref in the future.
    const pathObject = _.cloneDeep(specs.paths[path]);
    let hasPathMethods = false;

    METHODS.forEach((method) => {
      //only include properly tagged path methods
      let shouldInclude = pathObject[method] && pathObject[method].tags && pathObject[method].tags;

      if (!shouldInclude) {
        delete pathObject[method];
        return;
      }

      hasPathMethods = true;

      //Let path use global security for spec if none is specified
      //reason, global security for this spec cannot be applied across all other specs
      //so we need to localise to paths in this spec.
      //if path already has own security, no need to set.
      const methodSpec = pathObject[method];
      if (!methodSpec.hasOwnProperty('security')) {
        methodSpec.security = specs.security || [];
      }

      methodSpec.summary = methodSpec.tags.includes('service') ? `[Service] ${methodSpec.summary}` : methodSpec.summary;
      //we want to override tag grouping
      //so that services are properly grouped
      methodSpec.tags = methodSpec.tags.map((tag) => `${serviceId.capitalize()} Service`);
    });

    if (hasPathMethods) {
      let newPath = `/${serviceId}/${path}`.replace(/\/{2,}/g, '/');
      outObject[newPath] = pathObject;
    }
  }

  return outObject;
};

const mergeIntoDefinitions = (serviceId, specs, merged) => {
  //filter paths:
  const selectedPaths = selectPathsFromService(serviceId, specs);
  if (Object.keys(selectedPaths).length < 1) {
    console.log('#', serviceId, 'skipping as no valid paths found');
    return;
  }

  merged.paths = _.merge({}, merged.paths || {}, selectedPaths);
  //here we prefer already defined security definitions
  merged.securityDefinitions = _.merge({}, specs.securityDefinitions, merged.securityDefinitions);

  //prefer most common definitions also
  merged.definitions = _.merge({}, specs.definitions, merged.definitions);

  merged.parameters = _.merge({}, specs.parameters, merged.parameters);
};

module.exports.buildGatewaySpecs = (specifications) => {
  const gatewayApi = _.merge({ swagger: '2.0' }, baseObject);
  //merge definitions
  for (let serviceId in specifications) {
    if (specifications.hasOwnProperty(serviceId)) {
      mergeIntoDefinitions(serviceId, specifications[serviceId], gatewayApi);
    }
  }
  return gatewayApi;
};
