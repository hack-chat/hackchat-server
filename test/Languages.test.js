import { expect } from 'chai';
import { join, dirname, sep, basename } from 'path';
import { fileURLToPath } from 'url';

import pkg from 'fs-extra';
const { readdirSync, lstatSync, readJson } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const gatherFiles = (startPath, filter) => {
  let out = [];

  let files = readdirSync(startPath);
  for(let i = 0; i < files.length; i++) {
    let filename = join(startPath, files[i]);
    let stat = lstatSync(filename);
    if (stat.isDirectory()){
      out = out.concat(this.gatherFiles(filename, filter));
    } else if (filename.indexOf(filter) >= 0) {
      if (filename.endsWith('bad.json') === false) {
        out.push(filename);
      }
    }
  }

  return out;
}

const filesPath = `${dirname(__dirname)}${sep}src${sep}translations${sep}`;
const languageFiles = gatherFiles(filesPath, '.json');
let imported;

const testLanguages = async () => {
  for (let i = 0, j = languageFiles.length; i < j; i++) {
    try {
      imported = await readJson(languageFiles[i]);
    } catch (e) {
      const err = `Unable to load language file ${languageFiles[i]}\n${e}`;
      console.error(err);
    }

    describe(`Checking language file: ${basename(languageFiles[i])}`, () => {
      // Root containers
      it('should contain an "errors" object', () => {
        expect(imported.errors).to.be.a('object');
      });

      it('should contain a "config" object', () => {
        expect(imported.config).to.be.a('object');
      });

      it('should contain a "generate" object', () => {
        expect(imported.generate).to.be.a('object');
      });

      it('should contain an "import" object', () => {
        expect(imported.import).to.be.a('object');
      });

      // Errors container
      it('should contain an "errors.missingConfig" string', () => {
        expect(imported.errors.missingConfig).to.be.a('string');
      });

      it('should contain an "errors.badConfig" string', () => {
        expect(imported.errors.badConfig).to.be.a('string');
      });

      // Config container
      it('should contain an "config.configMode" string', () => {
        expect(imported.config.configMode).to.be.a('string');
      });

      it('should contain an "config.configModeSimple" string', () => {
        expect(imported.config.configModeSimple).to.be.a('string');
      });

      it('should contain an "config.configModeAdvanced" string', () => {
        expect(imported.config.configModeAdvanced).to.be.a('string');
      });

      it('should contain an "config.configName" string', () => {
        expect(imported.config.configName).to.be.a('string');
      });

      it('should contain an "config.cmdDirName" string', () => {
        expect(imported.config.cmdDirName).to.be.a('string');
      });

      it('should contain an "config.serverPort" string', () => {
        expect(imported.config.serverPort).to.be.a('string');
      });

      it('should contain an "config.rlHalflife" string', () => {
        expect(imported.config.rlHalflife).to.be.a('string');
      });

      it('should contain an "config.rlThreshold" string', () => {
        expect(imported.config.rlThreshold).to.be.a('string');
      });

      it('should contain an "config.pingSpeed" string', () => {
        expect(imported.config.pingSpeed).to.be.a('string');
      });

      it('should contain an "config.savePathInfo" string', () => {
        expect(imported.config.savePathInfo).to.be.a('string');
      });

      it('should contain an "config.existsWarning" string', () => {
        expect(imported.config.existsWarning).to.be.a('string');
      });

      it('should contain an "config.writeAborted" string', () => {
        expect(imported.config.writeAborted).to.be.a('string');
      });

      it('should contain an "config.writeSuccess" string', () => {
        expect(imported.config.writeSuccess).to.be.a('string');
      });

      it('should contain an "config.writeFailure" string', () => {
        expect(imported.config.writeFailure).to.be.a('string');
      });

      it('should contain an "config.createDir" string', () => {
        expect(imported.config.createDir).to.be.a('string');
      });

      // Generate container

      it('should contain an "generate.requiredText" string', () => {
        expect(imported.generate.requiredText).to.be.a('string');
      });

      it('should contain an "generate.nameLabel" string', () => {
        expect(imported.generate.nameLabel).to.be.a('string');
      });

      it('should contain an "generate.categoryLabel" string', () => {
        expect(imported.generate.categoryLabel).to.be.a('string');
      });

      it('should contain an "generate.cmdLabel" string', () => {
        expect(imported.generate.cmdLabel).to.be.a('string');
      });

      it('should contain an "generate.descriptionLabel" string', () => {
        expect(imported.generate.descriptionLabel).to.be.a('string');
      });

      it('should contain an "generate.usageLabel" string', () => {
        expect(imported.generate.usageLabel).to.be.a('string');
      });

      it('should contain an "generate.requiredLabel" string', () => {
        expect(imported.generate.requiredLabel).to.be.a('string');
      });

      it('should contain an "generate.hooksLabel" string', () => {
        expect(imported.generate.hooksLabel).to.be.a('string');
      });

      it('should contain an "generate.initLabel" string', () => {
        expect(imported.generate.initLabel).to.be.a('string');
      });

      it('should contain an "generate.choiceLabel" string', () => {
        expect(imported.generate.choiceLabel).to.be.a('string');
      });

      it('should contain an "generate.setNameLabel" string', () => {
        expect(imported.generate.setNameLabel).to.be.a('string');
      });

      it('should contain an "generate.setCategoryLabel" string', () => {
        expect(imported.generate.setCategoryLabel).to.be.a('string');
      });

      it('should contain an "generate.setCmdLabel" string', () => {
        expect(imported.generate.setCmdLabel).to.be.a('string');
      });

      it('should contain an "generate.setDescLabel" string', () => {
        expect(imported.generate.setDescLabel).to.be.a('string');
      });

      it('should contain an "generate.setUsageLabel" string', () => {
        expect(imported.generate.setUsageLabel).to.be.a('string');
      });

      it('should contain an "generate.setReqPropsLabel" string', () => {
        expect(imported.generate.setReqPropsLabel).to.be.a('string');
      });

      it('should contain an "generate.setHooksLabel" string', () => {
        expect(imported.generate.setHooksLabel).to.be.a('string');
      });

      it('should contain an "generate.setInitLabel" string', () => {
        expect(imported.generate.setInitLabel).to.be.a('string');
      });

      it('should contain an "generate.saveLabel" string', () => {
        expect(imported.generate.saveLabel).to.be.a('string');
      });

      it('should contain an "generate.cancelLabel" string', () => {
        expect(imported.generate.cancelLabel).to.be.a('string');
      });

      it('should contain an "generate.inputName" string', () => {
        expect(imported.generate.inputName).to.be.a('string');
      });

      it('should contain an "generate.inputCategory" string', () => {
        expect(imported.generate.inputCategory).to.be.a('string');
      });

      it('should contain an "generate.inputCmd" string', () => {
        expect(imported.generate.inputCmd).to.be.a('string');
      });

      it('should contain an "generate.inputDesc" string', () => {
        expect(imported.generate.inputDesc).to.be.a('string');
      });

      it('should contain an "generate.inputUsage" string', () => {
        expect(imported.generate.inputUsage).to.be.a('string');
      });

      it('should contain an "generate.inputRequiredData" string', () => {
        expect(imported.generate.inputRequiredData).to.be.a('string');
      });

      it('should contain an "generate.inputHookType" string', () => {
        expect(imported.generate.inputHookType).to.be.a('string');
      });

      it('should contain an "generate.inputHookIncoming" string', () => {
        expect(imported.generate.inputHookIncoming).to.be.a('string');
      });

      it('should contain an "generate.inputHookOutgoing" string', () => {
        expect(imported.generate.inputHookOutgoing).to.be.a('string');
      });

      it('should contain an "generate.inputHookName" string', () => {
        expect(imported.generate.inputHookName).to.be.a('string');
      });

      it('should contain an "generate.inputHookPriority" string', () => {
        expect(imported.generate.inputHookPriority).to.be.a('string');
      });

      it('should contain an "generate.inputInit" string', () => {
        expect(imported.generate.inputInit).to.be.a('string');
      });

      it('should contain an "generate.existsWarning" string', () => {
        expect(imported.generate.existsWarning).to.be.a('string');
      });

      it('should contain an "generate.writeSuccess" string', () => {
        expect(imported.generate.writeSuccess).to.be.a('string');
      });

      // Import container

      it('should contain an "import.importMode" string', () => {
        expect(imported.import.importMode).to.be.a('string');
      });

      it('should contain an "import.importAllLabel" string', () => {
        expect(imported.import.importAllLabel).to.be.a('string');
      });

      it('should contain an "import.importSomeLabel" string', () => {
        expect(imported.import.importSomeLabel).to.be.a('string');
      });

      it('should contain an "import.importRemoteLabel" string', () => {
        expect(imported.import.importRemoteLabel).to.be.a('string');
      });

      it('should contain an "import.somePrompt" string', () => {
        expect(imported.import.somePrompt).to.be.a('string');
      });

      it('should contain an "import.goodImport" string', () => {
        expect(imported.import.goodImport).to.be.a('string');
      });

      it('should contain an "import.failedImport" string', () => {
        expect(imported.import.failedImport).to.be.a('string');
      });

      it('should contain an "import.missingFeature" string', () => {
        expect(imported.import.missingFeature).to.be.a('string');
      });
    });
  }
}

testLanguages();

