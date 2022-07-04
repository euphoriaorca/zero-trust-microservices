/**
 * This Node.js script will generate a shell script that can be used to generate packages for Java/Node.js/TypeScript/Dart
 */

 const fs = require("fs");
 const YAML = require("js-yaml");
 const _ = require("lodash");
 const commandLineArgs = require("command-line-args");
 
 const configValues = require("./config.json");
 
 const BASE_NODE_PACKAGE_NAME = `service`;
 const IS_RELEASE = process.env.GITHUB_REF === "refs/heads/master";
 const { GITHUB_REPOSITORY } = process.env;
 const GIT_URL = `git://github.com/${GITHUB_REPOSITORY}.git`;
 
 const {
   version,
   swaggerCommand,
   githubOrganization,
   packageName
 } = configValues;
 
 // noinspection SpellCheckingInspection
 const SUPPORTED_LANGUAGES = [
   "typescript",
 ];
 
 const CHECKPOINT = `[ $? != 0 ] && exit 1`;
 
 const substituteProperties = (input, mappings) => {
   const object = _.cloneDeep(input);
   for (let prop in object) {
     if (typeof object[prop] === "object") {
       object[prop] = substituteProperties(object[prop], mappings);
     } else if (typeof object[prop] === "string") {
       object[prop] = doSubstitute(object[prop], mappings);
     }
   }
 
   return object;
 };
 
 const doSubstitute = (str, mappings) => {
   for (let ph in mappings) {
     str = str.replace(new RegExp(ph, "ig"), mappings[ph]);
   }
 
   return str;
 };
 
 const makeGeneratorOptions = options => {
   let cliArgs = [`${swaggerCommand} generate`];
 
   for (let opt in options) {
     if (opt !== "configOptions") {
       cliArgs.push(`  --${opt}='${options[opt]}'`);
     }
   }
 
   if (options.configOptions) {
     for (let opt in options.configOptions) {
       cliArgs.push(`  -D${opt}='${options.configOptions[opt]}'`);
     }
   }
 
   return cliArgs.join(" \\\n");
 };
 
 const generatePackageBuildScript = (options, buildOnly = false) => {
   let script = "";
   switch (options.lang) {
     case "typescript-node":
       // noinspection SpellCheckingInspection
       script = `
 echo "registry=https://npm.pkg.github.com/${githubOrganization}" > .npmrc
 json -I -f package.json -e "this.repository=\\"${GIT_URL}\\""
 json -I -f package.json -e "this.name=\\"@${githubOrganization.toLowerCase()}/${options
         .configOptions.projectName || options.configOptions.npmName}\\""
 \n
 `;
       if (options.lang === "javascript") {
         script += `npm install && npm test`;
       } else {
         script += `
 sed -i "s/static discriminator = undefined;//" api.ts
 sed -i "s/public username: string;/public username: string | undefined;/" api.ts
 sed -i "s/public password: string;/public password: string | undefined;/" api.ts
 sed -i "s/public apiKey: string;/public apiKey: string | undefined;/" api.ts
 sed -i "s/public accessToken: string;/public accessToken: string | undefined;/" api.ts
 
 npm install && npm run build
 `;
       }
 
       if (!buildOnly) {
         script += `\nnpm publish`;
       }
 
       break;
   }
 
   return `echo '#!/bin/bash
 cd "$(dirname "$0")"
 ${script}' > ${options.output}/publish.sh`;
 };
 
 const optionDefinitions = [
   { name: "specs", type: String, defaultValue: "resolved" },
   { name: "output", type: String, defaultValue: "output" },
   { name: "script", alias: "s", defaultValue: "generate.sh" },
   { name: "skipDeploy", type: Boolean, defaultValue: false },
   { name: "lang", alias: "l", type: String, multiple: true }
 ];
 
 /**
  *
  * @type {{specs: String, output: String, script: String, skipDeploy: boolean, lang: String}}
  */
 const options = commandLineArgs(optionDefinitions);
 
 let targetLanguages = [];
 if (options.lang && options.lang.length > 0) {
   targetLanguages = options.lang;
 } else {
   targetLanguages = SUPPORTED_LANGUAGES;
 }
 
 if (!fs.existsSync(options.specs)) {
   console.error("Specs folder does not exist");
   process.exit(1);
 }
 
 const templateArguments = {};
 
 const snapshotSuffix = Math.round(Date.now() / 10000);
 
 const baseTsPackage = `${packageName}.__SERVICE_ID__`;
 templateArguments.typescript = {
   lang: "typescript-node",
   configOptions: {
     npmName: `${BASE_NODE_PACKAGE_NAME}-__SERVICE_ID__-ts`,
     npmVersion: `${version}${IS_RELEASE ? "" : "-SNAPSHOT." + snapshotSuffix}`,
     supportsES6: true,
     modelPackage: `${baseTsPackage}.models`,
     apiPackage: `${baseTsPackage}.api`,
     invokerPackage: `${baseTsPackage}.invoker`,
     licenseName: "UNLICENSED"
   }
 };
 
 const FINAL_OUTPUT = [];
 
 FINAL_OUTPUT.push("#!/bin/bash", "#This is an auto-generated script");
 
 FINAL_OUTPUT.push('echo "Creating output directories"');
 SUPPORTED_LANGUAGES.forEach(lang => {
   if (targetLanguages.includes(lang)) {
     FINAL_OUTPUT.push(`mkdir -p ${options.output}/${lang}`);
   }
 });
 
 FINAL_OUTPUT.push("", "");
 
 const dirPointer = fs.readdirSync(options.specs, {
   withFileTypes: true
 });
 
 for (let ent of dirPointer) {
   if (ent.name.match(/\.ya?ml$/i)) {
     //generate
     let fullName = `${options.specs}/${ent.name}`;
     console.log("Loading: ", fullName);
     let serviceId = ent.name
       .split(".")
       .shift()
       .replace(/[^a-z0-9A-Z]/gi, "")
       .toLowerCase();
     console.log("\tservice ID:", serviceId);
     const apiSpec = YAML.load(fs.readFileSync(fullName).toString());
     const description = apiSpec.info && apiSpec.info.title;
 
     FINAL_OUTPUT.push(`echo "Processing file ${fullName}"`);
     SUPPORTED_LANGUAGES.filter(l => targetLanguages.includes(l)).forEach(
       lang => {
         let langConfig = _.cloneDeep(templateArguments[lang]);
         langConfig = substituteProperties(langConfig, {
           __SERVICE_ID__: serviceId,
           __SERVICE_DESCRIPTION__: description
         });
 
         langConfig.output = `${options.output}/${lang}/${serviceId}`;
         langConfig["input-spec"] = fullName;
 
         if (lang === "javascript" || lang === "typescript") {
           langConfig["type-mappings"] = "BigDecimal=Number";
         }
 
         FINAL_OUTPUT.push(
           "",
           `echo "Generating files for file -> ${fullName}, Language -> ${lang}"`
         );
         FINAL_OUTPUT.push(
           makeGeneratorOptions(langConfig),
           CHECKPOINT,
           generatePackageBuildScript(langConfig, options.skipDeploy),
           CHECKPOINT,
           ""
         );
       }
     );
 
     FINAL_OUTPUT.push("");
   }
 }
 
 FINAL_OUTPUT.push("exit 0");
 console.log("Publishing shell script to", options.script);
 fs.writeFileSync(options.script, FINAL_OUTPUT.join("\n"), {
   encoding: "utf8"
 });
 