const YAML = require('js-yaml');
const fs = require('fs');
const _ = require('lodash');
const merger = require('./lib/MergerLib');
const gatewayBuilder = require('./lib/GatewayBuilder');

//Config variables
const SPECS_DIR = './specs';
const RESOLVED_DIR = './resolved';
const GATEWAY_OUTPUT_FILE = 'api-gateway.yaml';
const GATEWAY_OUTPUT_FILE_JSON = 'api-gateway.json';

if (!fs.existsSync(RESOLVED_DIR)) {
  fs.mkdirSync(RESOLVED_DIR);
}

const specifications = {};
const dirPointer = fs.readdirSync(SPECS_DIR, {
  withFileTypes: true,
});

const common = YAML.load(fs.readFileSync(`${SPECS_DIR}/_common.yaml`).toString());

for (let ent of dirPointer) {
  if (ent.name.match(/\.ya?ml$/i) && !ent.name.startsWith('_') && ent.name !== GATEWAY_OUTPUT_FILE) {
    let fullName = `${SPECS_DIR}/${ent.name}`;
    console.log('Loading: ', fullName);
    let tag = merger.generateServiceId(ent.name);

    const apiSpec = YAML.load(fs.readFileSync(fullName).toString());

    apiSpec.definitions = _.merge({}, common.definitions, apiSpec.definitions);
    apiSpec.parameters = _.merge({}, common.parameters, apiSpec.parameters);

    specifications[tag] = merger.resolveApiSpecs(apiSpec, tag);

    const outPath = `${RESOLVED_DIR}/${tag}.yaml`;
    console.log(tag, 'Writing resolved to:', outPath);

    let outString = `#Resolved version of ${fullName}\n`;
    outString += YAML.dump(specifications[tag]);
    fs.writeFileSync(outPath, outString, { encoding: 'utf8' });

    const outJsonPath = `${RESOLVED_DIR}/${tag}.json`;
    fs.writeFileSync(outJsonPath, JSON.stringify(specifications[tag], null, '  '), { encoding: 'utf8' });
  }
}

console.log('Merging gateway specs');

const gatewayApi = merger.resolveApiSpecs(gatewayBuilder.buildGatewaySpecs(specifications), 'gateway');
fs.writeFileSync(`${RESOLVED_DIR}/${GATEWAY_OUTPUT_FILE}`, YAML.dump(gatewayApi), { encoding: 'utf8' });
fs.writeFileSync(`${RESOLVED_DIR}/${GATEWAY_OUTPUT_FILE_JSON}`, JSON.stringify(gatewayApi, null, ' '), { encoding: 'utf8' });
