import { Command } from 'commander';
import _ from 'lodash';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import {ModelTemplate} from '../templates';
import {Models} from './models';
import {Prompts} from './prompts';

export const commander = new Command();

commander.name("represent");

commander.option("-s, --src-dir <srcDir>", "Directory to look for models", "src/models");

commander.option("-p, --package <packageFile>", "package.json file path", "./package.json");

commander.option("-m, --manager <manager>", "Package manager. Accepts: 'npm', 'yarn', 'autodetect'", "autodetect");

commander.option("--dry-run", "Do not commit. STILL DOES EDITS", false);

commander.option("--signoff <signoff-message>", "Signoff message", "");

commander.command("interactive").description("Interactive mode lets you create/update/delete multiple models without exiting")
	.action(async () => {
		while(true) {
			const indexFilePath = `${commander.opts()['srcDir']}/index.ts`;
			let indexContent = existsSync(indexFilePath) ? readFileSync(indexFilePath).toString("utf8") : '';
			const action = await Prompts.interactiveStartAction();
			const isModel = _.includes(Models.getExistingModels(), action);
			if (isModel) {
				const modelInstance = ModelTemplate.render(
					readFileSync(`${commander.opts()['srcDir']}/${Models.generateFileName(action)}.ts`).toString("utf8")
				);
				const modelAction = await Prompts.modelAction(modelInstance);
				const isProperty = _.includes(modelInstance.properties.find().map(property => property.name), modelAction);
				const isRelation = _.includes(modelInstance.relations.find().map(relation => relation.name), modelAction);
				if (isProperty) {
					const propAction = await Prompts.propertyAction();
					let updatedModelInstance = modelInstance;
					if (propAction === "UPDATE_PROPERTY") {
						updatedModelInstance = await Prompts.updatePropertyAction(updatedModelInstance, modelAction);
					} else if (propAction === "DELETE_PROPERTY") {
						updatedModelInstance.properties.remove(modelAction);
					} else {
						// TODO: ADD CONVERT_PROPERTY HANDLER
						console.error("NOT YET IMPLEMENTED");
					}
					writeFileSync(
						`${commander.opts()['srcDir']}/${Models.generateFileName(updatedModelInstance.name)}.ts`,
						updatedModelInstance.generate()
					);
				} else if (isRelation) {
					const relatAction = await Prompts.relationAction();
					let updatedModelInstance = modelInstance;
					if (relatAction === "UPDATE_RELATION") {
						updatedModelInstance = await Prompts.updateRelationAction(updatedModelInstance, modelAction);
					} else if (relatAction === "DELETE_RELATION") {
						updatedModelInstance.relations.remove(modelAction);
					} else {
						// TODO: ADD CONVERT_PROPERTY HANDLER
						console.error("NOT YET IMPLEMENTED");
					}
					writeFileSync(
						`${commander.opts()['srcDir']}/${Models.generateFileName(updatedModelInstance.name)}.ts`,
						updatedModelInstance.generate()
					);
				} else if (modelAction === "DELETE_MODEL") {
					indexContent = Models.removeModelFromIndex(indexContent, action);
					Models.deleteModel(action);
					writeFileSync(indexFilePath, indexContent);
				} else {
					const updateAction = await Prompts.updateModelAction();
					if (updateAction === "NAME_URI") {
						const updatedModelInstance = await Prompts.updateModelNameAndUriAction(modelInstance);
						if (updatedModelInstance.name !== modelInstance.name) {
							indexContent = Models.removeModelFromIndex(indexContent, modelInstance.name);
							Models.deleteModel(modelInstance.name);
							indexContent = Models.appendModelToIndex(indexContent, updatedModelInstance.name);
							writeFileSync(indexFilePath, indexContent);
						}
						writeFileSync(
							`${commander.opts()['srcDir']}/${Models.generateFileName(updatedModelInstance.name)}.ts`,
							updatedModelInstance.generate()
						);
					} else if (updateAction === "ADD_PROPERTY") {
						const updatedModelInstance = await Prompts.newPropertyAction(modelInstance);
						writeFileSync(
							`${commander.opts()['srcDir']}/${Models.generateFileName(updatedModelInstance.name)}.ts`,
							updatedModelInstance.generate()
						);
					} else if (updateAction === "ADD_RELATION") {
						const updatedModelInstance = await Prompts.newRelationAction(modelInstance);
						writeFileSync(
							`${commander.opts()['srcDir']}/${Models.generateFileName(updatedModelInstance.name)}.ts`,
							updatedModelInstance.generate()
						);
					}
				}
			} else {
				await Prompts.modelStartAction();
			}
		}
	})
	.alias("i");

commander.command("model").description("Create a model then exit")
	.action(async () => {
		await Prompts.modelStartAction();
	})
	.alias("m");

commander.command("property").description("Add/update/remove a property then exit")
	.action(async () => {
		await Prompts.propertiesStartAction();
	})
	.alias("p");

commander.command("relation").description("Add/update/remove a relation then exit")
	.action(async () => {
		await Prompts.relationsStartAction();
	})
	.alias("r");
