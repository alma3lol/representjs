#!/usr/bin/env node

const { CLI } = require('../dist');
const pkg = require('../package.json');
const {existsSync} = require('fs');
const path = require('path');
const Chalk = require('chalk');
const _ = require('lodash');
const { exec } = require('child_process');

module.exports = CLI.commander;

CLI.commander.version(pkg.version);

if (require.main == module) {
	CLI.commander.parse(process.argv);
	if (CLI.commander.opts()['dryRun']) CLI.gitter.dryRun = true;
	if (CLI.commander.opts()['signoff']) CLI.gitter.signoff = CLI.commander.opts()['signoff'];
	const PACKAGE_PATH = path.join(process.cwd(), CLI.commander.opts()['package']);
	const YARN_LOCK_PATH = path.join(path.dirname(PACKAGE_PATH), "yarn.lock");
	const NPM_LOCK_PATH = path.join(path.dirname(PACKAGE_PATH), "package-lock.json");
	let isRepresentInstalled = false;
	if (!existsSync(PACKAGE_PATH)) {
		console.error(`${Chalk.red("package.json does not exist!")}\nPlease ensure you're in the right folder.`);
		process.exit(1);
	} else {
		const appPkg = require(PACKAGE_PATH);
		isRepresentInstalled = _.has(appPkg.dependencies, "@alma3lol/represent");
	}
	let isYarn = false;
	let isNpm = false;
	if (CLI.commander.opts()['manager'] === 'autodetect') {
		isYarn = existsSync(YARN_LOCK_PATH);
		isNpm = existsSync(NPM_LOCK_PATH);
	} else if (CLI.commander.opts()['manager'] === 'yarn') {
		isYarn = true;
	} else if (CLI.commander.opts()['manager'] === 'npm') {
		isNpm = true;
	}
	if (!isYarn && !isNpm) {
		console.error(Chalk.red("Couldn't detect npm nor yarn! Please use --manager"));
		process.exit(1);
	} else {
		let installCommand =  "";
		if (isYarn) {
			installCommand = "yarn add";
		} else {
			installCommand = "npm install";
		}
		if (!isRepresentInstalled) {
			exec(`${installCommand} @alma3lol/represent`, (err, __, ___) => {
				if (err) throw err;
			});
		}
	}
}
