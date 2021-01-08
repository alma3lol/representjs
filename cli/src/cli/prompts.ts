import Inqueirer from 'inquirer';
import _ from 'lodash';
import Chalk from 'chalk';
import {Models} from './models';
import {ModelTemplate} from '../templates';
import {Templates} from '../types';
import {commander} from './commander';
import {readFileSync, writeFileSync, existsSync} from 'fs';
import {gitter} from './gitter';

Inqueirer.registerPrompt("autocomplete", require("inquirer-autocomplete-prompt"));

const orange = Chalk.rgb(230, 82, 35);

/**
 * Prompts namespace
 */
export namespace Prompts {
	/**
	 * Prompt for inter mode start action
	 *
	 * @return string Start action
	 */
	export const interactiveStartAction = async (): Promise<string> => {
		console.clear();
		const choices: Inqueirer.DistinctChoice<Inqueirer.ListChoiceMap<any>>[] = [
			{
				name: "Create a model",
				value: "CREATE_MODEL"
			}
		];
		Models.getExistingModels().forEach(modelName => {
			choices.push({
				name: modelName,
				value: modelName
			});
		});
		const { action } = await Inqueirer.prompt([
			{
				name: "action",
				message: "Choose a model or create a new one:",
				type: "autocomplete",
				source: (__, input) => {
					if (input) {
						return _.filter(choices, (model: any) => model.name.toLowerCase().includes(input.toLowerCase()));
					}
					return choices;
				}
			}
		]);
		return action;
	}
	/**
	 * Prompt for model start action
	 */
	export const modelStartAction = async () => {
		console.clear();
		const indexFilePath = `${commander.opts()['srcDir']}/index.ts`;
		let indexContent = existsSync(indexFilePath) ? readFileSync(indexFilePath).toString("utf8") : '';
		let newIndexContent = indexContent;
		const { inputModelName, inputModelUri } = await Inqueirer.prompt([
			{
				name: 'inputModelName',
				message: 'Model name: ',
				type: 'input'
			},
			{
				name: 'inputModelUri',
				message: 'Model URI: ',
				type: 'input'
			}
		]);
		let modelInstance = new ModelTemplate({
			name: inputModelName,
			uri: inputModelUri,
			table: Models.generateTableName(inputModelName),
			properties: [],
			relations: []
		});
		modelInstance = await newPropertyAction(modelInstance);
		modelInstance = await newRelationAction(modelInstance);
		newIndexContent = Models.appendModelToIndex(indexContent, modelInstance.name);
		writeFileSync(indexFilePath, newIndexContent);
		writeFileSync(
			`${commander.opts()['srcDir']}/${Models.generateFileName(modelInstance.name)}.ts`,
			modelInstance.generate()
		);
	}
	/**
	 * Prompt for properties start action
	 */
	export const propertiesStartAction = async () => {
		const modelAction = await interactiveStartAction();
		const isModel = _.includes(Models.getExistingModels(), modelAction);
		if (isModel) {
			const model = ModelTemplate.render(
				readFileSync(`${commander.opts()['srcDir']}/${Models.generateFileName(modelAction)}.ts`).toString("utf8")
			);
			const updatedModelInstance = await propertiesAction(model);
			writeFileSync(
				`${commander.opts()["srcDir"]}/${Models.generateFileName(updatedModelInstance.name)}.ts`,
				updatedModelInstance.generate()
			);
		} else {
			await modelStartAction();
		}
	}
	/**
	 * Prompt for relations start action
	 */
	export const relationsStartAction = async () => {
		const modelAction = await interactiveStartAction();
		const isModel = _.includes(Models.getExistingModels(), modelAction);
		if (isModel) {
			const model = ModelTemplate.render(
				readFileSync(`${commander.opts()['srcDir']}/${Models.generateFileName(modelAction)}.ts`).toString("utf8")
			);
			const updatedModelInstance = await relationsAction(model);
			writeFileSync(
				`${commander.opts()["srcDir"]}/${Models.generateFileName(updatedModelInstance.name)}.ts`,
				updatedModelInstance.generate()
			);
		} else {
			await modelStartAction();
		}
	}
	/**
	 * Prompt for model action
	 *
	 * @param model Model instance to perform action on
	 *
	 * @return string Model action
	 */
	export const modelAction = async (model: ModelTemplate): Promise<string> => {
		const choices: Inqueirer.DistinctChoice<Inqueirer.ListChoiceMap<any>>[] = [
			{
				name: Chalk.red("Delete model"),
				value: "DELETE_MODEL"
			},
			{
				name: Chalk.yellow("Update model"),
				value: "UPDATE_MODEL"
			}
		];
		choices.push({
			name: "",
			type: "separator",
			line: "--------------\n  | Properties |\n  --------------"
		});
		model.properties.find().forEach(property => {
			choices.push({
				name: property.name,
				value: property.name
			});
		});
		if (model.relations.find().length > 0) choices.push({
			name: "",
			type: "separator",
			line: "-------------\n  | Relations |\n  -------------"
		});
		model.relations.find().forEach(relation => {
			choices.push({
				name: relation.name,
				value: relation.name
			});
		});
		const { action } = await Inqueirer.prompt([
			{
				name: "action",
				message: "Choose to delete the model, update a property/relation or add a new one: ",
				type: "autocomplete",
				source: (__, input) => {
					if (input) {
						return _.filter(choices, (model: any) => model.name.toLowerCase().includes(input.toLowerCase()));
					}
					return choices;
				},
				pageSize: 10
			}
		]);
		return action;
	}
	/**
	 * Prompt for update model action
	 *
	 * @return string Update action
	 */
	export const updateModelAction = async (): Promise<string> => {
		const choices: Inqueirer.DistinctChoice<Inqueirer.ListChoiceMap<any>>[] = [
			{
				name: "Update model's name/uri",
				value: "NAME_URI"
			},
			{
				name: "Add a property",
				value: "ADD_PROPERTY"
			},
			{
				name: "Add a relation",
				value: "ADD_RELATION"
			}
		];
		const { action } = await Inqueirer.prompt([
			{
				name: "action",
				message: "Choose an update action:",
				type: "autocomplete",
				source: (__, input) => {
					if (input) {
						return _.filter(choices, (model: any) => model.name.toLowerCase().includes(input.toLowerCase()));
					}
					return choices;
				},
				pageSize: 10
			}
		]);
		return action;
	}
	/**
	 * Prompt for update model name & uri action
	 *
	 * @param model Model to update
	 *
	 * @return ModelTemplate The modified model instance
	 */
	export const updateModelNameAndUriAction = async (model: ModelTemplate) => {
		let ignoreRenameWarning = false;
		const { newModelName, newModelURI } = await Inqueirer.prompt([
			{
				name: "newModelName",
				default: model.name,
				type: "input",
				message: "Model name:",
				validate: (input) => {
					if (!ignoreRenameWarning && input !== model.name) {
						ignoreRenameWarning = true;
						return `${orange("WARNING: Renaming a model will map it to a new indexedDB table,\n            making offline data unavailable.")}\n${Chalk.red(">> Hit ENTER to confirm.")}`;
					}
					return true;
				}
			},
			{
				name: 'newModelURI',
				default: model.URI,
				type: "input",
				message: "Model URI:"
			}
		]);
		const commitMessageExtraLines: string[] = [];
		if (model.name !== newModelName) commitMessageExtraLines.push(`- renames model '${model.name}' to '${newModelName}'`);
		if (model.URI !== newModelURI) commitMessageExtraLines.push(`- changes URI from '${model.URI}' to '${newModelURI}'`);
		model.name = newModelName;
		model.table = Models.generateTableName(newModelName);
		model.URI = newModelURI;
		if (commitMessageExtraLines.length > 0) {
			gitter.commit(
				`refactor(models): updates model '${model.name}'`,
				[`${commander.opts()['srcDir']}/${Models.generateFileName(model.name)}.ts`],
				commitMessageExtraLines
			);
		}
		return model;
	}
	/**
	 * Prompt for properties action
	 *
	 * @param model Model template class
	 *
	 * @return ModelTemplate Update model instance
	 */
	export const propertiesAction = async (model: ModelTemplate): Promise<ModelTemplate> => {
		const choices: Inqueirer.DistinctChoice<Inqueirer.ListChoiceMap<any>>[] = [
			{
				name: "Add a property",
				value: "ADD_PROPERTY"
			}
		];
		model.properties.find().forEach(property => {
			choices.push({
				name: property.name,
				value: property.name
			});
		});
		const { action } = await Inqueirer.prompt([
			{
				name: "action",
				message: "Choose a property or add a new one: ",
				type: "autocomplete",
				source: (__, input) => {
					if (input) {
						return _.filter(choices, (model: any) => model.name.toLowerCase().includes(input.toLowerCase()));
					}
					return choices;
				},
				pageSize: 10
			}
		]);
		const isProperty = _.find(model.properties.find(), { name: action }) ? true : false;
		if (isProperty) {
			const propAction = await propertyAction();
			if (propAction === "UPDATE_PROPERTY") {
				return updatePropertyAction(model, action);
			} else if (propAction === "DELETE_PROPERTY") {
				model.properties.remove(action);
				gitter.commit(
					`refactor(models): removes property '${action}' from model '${model.name}'`,
					[`${commander.opts()['srcDir']}/${Models.generateFileName(model.name)}.ts`]
				);
				return model;
			} else {
				// TODO: ADD CONVERT_PROPERTY HANDLER
				// TODO: ADD COMMIT
				console.error("NOT YET IMPLEMENTED");
				return model;
			}
		} else {
			return newPropertyAction(model);
		}
	}
	/**
	 * Prompt for property action
	 *
	 * @return string Property action
	 */
	export const propertyAction = async (): Promise<string> => {
		const choices: Inqueirer.DistinctChoice<Inqueirer.ListChoiceMap<any>>[] = [
			{
				name: Chalk.red("Delete property"),
				value: "DELETE_PROPERTY"
			},
			{
				name: Chalk.yellow("Update property"),
				value: "UPDATE_PROPERTY"
			},
			{
				name: "Convert to a relation",
				value: "CONVERT_PROPERTY"
			}
		];
		const { action } = await Inqueirer.prompt([
			{
				name: "action",
				message: "Choose an action:",
				type: "autocomplete",
				source: (__, input) => {
					if (input) {
						return _.filter(choices, (action: any) => action.name.toLowerCase().includes(input.toLowerCase()));
					}
					return choices;
				}
			}
		]);
		return action;
	}
	/**
	 * Prompt for a new property
	 *
	 * @param model Model template class
	 *
	 * @return ModelTemplate
	 **/
	export const newPropertyAction = async (model: ModelTemplate): Promise<ModelTemplate> => {
		console.clear();
		const usedClassProps = Models.usedClassProps(model);
		const properties: { propertyName: string, idProperty?: boolean, propertyType: string, propertyArrayType?: string, required?: boolean, defaultValue?: any }[] = [];
		model.properties.find().forEach(property => {
			properties.push({
				propertyType: property.type,
				propertyName: property.name,
				required: property.required,
				idProperty: property.id,
				defaultValue: property.defaultValue,
				propertyArrayType: property.arrType
			});
		});
		let idPropertyHasBeenTaken = _.find(model.properties.find(), { id: true }) ? true : false;
		while(true) {
			const property = await Inqueirer.prompt([
				{
					name: "propertyName",
					message: "Property name: ",
					type: "input",
					validate: propertyName => {
						const result = _.includes(usedClassProps, propertyName);
						if (result) {
							return Chalk.red("Property name already exists!");
						}
						return true;
					}
				},
				{
					name: "idProperty",
					default: false,
					message: "Is this the ID property?",
					type: "confirm",
					when: answer => answer.propertyName && !idPropertyHasBeenTaken
				},
				{
					name: "propertyType",
					message: "Type: ",
					type: "list",
					choices: [
						{
							name: "String",
							value: "string"
						},
						{
							name: "Boolean",
							value: "boolean",
							disabled: answer => answer.idProperty
						},
						{
							name: "Number",
							value: "number"
						},
						{
							name: "Object",
							value: "object",
							disabled: answer => answer.idProperty
						},
						{
							name: "Array",
							value: "array",
							disabled: answer => answer.idProperty
						}
					],
					when: answer => answer.propertyName
				},
				{
					name: "propertyArrayType",
					message: "Array Type: ",
					type: "list",
					choices: [
						{
							name: "String",
							value: "string"
						},
						{
							name: "Boolean",
							value: "boolean"
						},
						{
							name: "Number",
							value: "number"
						},
						{
							name: "Object",
							value: "object"
						}
					],
					when: answer => answer.propertyName && answer.propertyType === "array"
				},
				{
					name: "required",
					message: "Is it required?",
					type: "confirm",
					default: true,
					when: answer => answer.propertyName && !answer.idProperty
				},
				{
					name: "shouldHaveDefaultValue",
					message: "Does it have a default value?",
					type: "confirm",
					default: false,
					when: answer => !answer.idProperty && !answer.required && answer.propertyName
				},
				{
					name: "defaultValue",
					message: "Default value: ",
					type: "input",
					when: answer => answer.shouldHaveDefaultValue
				}
			]);
			if (property.propertyName === "") break;
			if (property.idProperty === true) idPropertyHasBeenTaken = true;
			_.unset(property, "shouldHaveDefaultValue");
			properties.push(property);
			console.log();
		}
		const updatedModelInstance = new ModelTemplate({
			name: model.name,
			uri: model.URI,
			table: model.table,
			relations: model.relations.find(),
			properties: []
		});
		properties.forEach(property => {
			const prop: Templates.Models.Property = {
				type: property.propertyType as any,
				name: property.propertyName
			}
			if (property.idProperty) prop.id = true;
			if (property.propertyArrayType) prop.arrType = property.propertyArrayType as any;
			if (property.defaultValue) prop.defaultValue = property.defaultValue;
			if (property.required || property.idProperty) prop.required = true;
			updatedModelInstance.properties.add(prop);
		});
		const MODEL_ALREADY_EXIST = _.includes(Models.getExistingModels(), updatedModelInstance.name);
		if (MODEL_ALREADY_EXIST) {
			gitter.commit(
				`refactor(models): adds properties to model '${updatedModelInstance.name}'`,
				[`${commander.opts()['srcDir']}/${Models.generateFileName(model.name)}.ts`]
			);
		}
		return updatedModelInstance;
	}
	/**
	 * Prompt for property update
	 *
	 * @param model Model template class
	 * @param property Property to update
	 *
	 * @return ModelTemplate Updated model instance
	 */
	export const updatePropertyAction = async (model: ModelTemplate, property: string) => {
		const usedClassProps = Models.usedClassProps(model);
		const properties: { propertyName: string, idProperty?: boolean, propertyType: string, propertyArrayType?: string, required?: boolean, defaultValue?: any }[] = [];
		model.properties.find().forEach(prop => {
			properties.push({
				propertyType: prop.type,
				propertyName: prop.name,
				required: prop.required,
				idProperty: prop.id,
				defaultValue: prop.defaultValue,
				propertyArrayType: prop.arrType
			});
		});
		let idPropertyHasBeenTaken = _.find(model.properties.find(), { id: true }) ? true : false;
		const propertyBeforeUpdate = model.properties.find(property)[0];
		const updatedProperty = await Inqueirer.prompt([
			{
				name: "propertyName",
				message: "New Property name: ",
				type: "input",
				default: property,
				validate: propertyName => {
					const result = _.includes(usedClassProps, propertyName);
					console.log(propertyName);
					if (result) {
						if (propertyName !== property)
							return Chalk.red("Property name already exists!");
						else
							return true;
					}
					return true;
				}
			},
			{
				name: "idProperty",
				default: propertyBeforeUpdate.id ?? false,
				message: "Is this the ID property?",
				type: "confirm",
				when: () => !idPropertyHasBeenTaken
			},
			{
				name: "propertyType",
				message: "Type: ",
				type: "list",
				choices: [
					{
						name: "String",
						value: "string"
					},
					{
						name: "Boolean",
						value: "boolean",
						disabled: () => propertyBeforeUpdate.id
					},
					{
						name: "Number",
						value: "number"
					},
					{
						name: "Object",
						value: "object",
						disabled: () => propertyBeforeUpdate.id
					},
					{
						name: "Array",
						value: "array",
						disabled: () => propertyBeforeUpdate.id
					}
				],
				when: answer => answer.propertyName
			},
			{
				name: "propertyArrayType",
				message: "Array Type: ",
				type: "list",
				choices: [
					{
						name: "String",
						value: "string"
					},
					{
						name: "Boolean",
						value: "boolean"
					},
					{
						name: "Number",
						value: "number"
					},
					{
						name: "Object",
						value: "object"
					}
				],
				when: answer => answer.propertyType === "array" || propertyBeforeUpdate.type === "array"
			},
			{
				name: "required",
				message: "Is it required?",
				type: "confirm",
				default: propertyBeforeUpdate.required !== undefined ? propertyBeforeUpdate.required : true,
				when: answer => !answer.idProperty && !propertyBeforeUpdate.id
			},
			{
				name: "shouldHaveDefaultValue",
				message: "Does it have a default value?",
				type: "confirm",
				default: false,
				when: answer => !answer.idProperty && !answer.required && !propertyBeforeUpdate.id && !propertyBeforeUpdate.required
			},
			{
				name: "defaultValue",
				message: "Default value: ",
				type: "input",
				default: propertyBeforeUpdate.defaultValue,
				when: answer => answer.shouldHaveDefaultValue
			}
		]);
		const updatedProp: Templates.Models.Property = {
			...propertyBeforeUpdate,
			type: updatedProperty.propertyType,
			name: updatedProperty.propertyName ?? property
		}
		const commitMessageExtraLines: string[] = []
		if (updatedProp.name !== property) commitMessageExtraLines.push(`- changes property name to '${updatedProp.name}'`);
		if (updatedProperty.idProperty) {
			updatedProp.id = true;
		}
		if (
			propertyBeforeUpdate.type !== updatedProp.type ||
			propertyBeforeUpdate.arrType !== updatedProperty.propertyArrayType
		) commitMessageExtraLines.push("- changes property type");
		if (updatedProperty.propertyArrayType) {
			updatedProp.arrType = updatedProperty.propertyArrayType as any;
		}
		if (updatedProperty.defaultValue) {
			updatedProp.defaultValue = updatedProperty.defaultValue;
			if (updatedProp.defaultValue !== propertyBeforeUpdate.defaultValue) commitMessageExtraLines.push("- changes property's default value");
		}
		if (updatedProperty.required || updatedProperty.idProperty) {
			updatedProp.required = true;
			if (!propertyBeforeUpdate.id) commitMessageExtraLines.push("- marks property as ID");
			else commitMessageExtraLines.push("- marks property as required");
		}
		model.properties.update(property, updatedProp);
		gitter.commit(
			`refactor(models): updates property '${property}' in model '${model.name}'`,
			[`${commander.opts()['srcDir']}/${Models.generateFileName(model.name)}.ts`],
			commitMessageExtraLines
		);
		return model;
	}
	/**
	 * Prompt for relations action
	 *
	 * @param model Model template class
	 *
	 * @return ModelTemplate Updated model instance
	 */
	export const relationsAction = async (model: ModelTemplate): Promise<ModelTemplate> => {
		const choices: Inqueirer.DistinctChoice<Inqueirer.ListChoiceMap<any>>[] = [
			{
				name: "Add a relation",
				value: "ADD_RELATION"
			}
		];
		model.relations.find().forEach(relation => {
			choices.push({
				name: relation.name,
				value: relation.name
			});
		});
		const { action } = await Inqueirer.prompt([
			{
				name: "action",
				message: "Choose a relation or add a new one: ",
				type: "autocomplete",
				source: (__, input) => {
					if (input) {
						return _.filter(choices, (relation: any) => relation.name.toLowerCase().includes(input.toLowerCase()));
					}
					return choices;
				},
				pageSize: 10
			}
		]);
		const isRelation = _.find(model.relations.find(), { name: action }) ? true : false;
		if (isRelation) {
			const relatAction = await relationAction();
			if (relatAction === "UPDATE_RELATION") {
				return updateRelationAction(model, action);
			} else if (relatAction === "DELETE_RELATION") {
				model.relations.remove(action);
				gitter.commit(
					`refactor(models): removes relation '${action}' from model '${model.name}'`,
					[`${commander.opts()['srcDir']}/${Models.generateFileName(model.name)}.ts`]
				);
				return model;
			} else {
				// TODO: ADD CONVERT_RELATION HANDLER
				console.error("NOT YET IMPLEMENTED");
				return model;
			}
		} else {
			return newRelationAction(model);
		}
	}
	/**
	 * Prompt for relation action
	 *
	 * @return string Relation action
	 */
	export const relationAction = async (): Promise<string> => {
		const choices: Inqueirer.DistinctChoice<Inqueirer.ListChoiceMap<any>>[] = [
			{
				name: Chalk.red("Delete relation"),
				value: "DELETE_RELATION"
			},
			{
				name: Chalk.yellow("Update relation"),
				value: "UPDATE_RELATION"
			},
			{
				name: "Convert to a relation",
				value: "CONVERT_RELATION"
			}
		];
		const { action } = await Inqueirer.prompt([
			{
				name: "action",
				message: "Choose an action:",
				type: "autocomplete",
				source: (__, input) => {
					if (input) {
						return _.filter(choices, (action: any) => action.name.toLowerCase().includes(input.toLowerCase()));
					}
					return choices;
				}
			}
		]);
		return action;
	}
	/**
	 * Prompt for a new relation action
	 *
	 * @param model Model template class
	 *
	 * @return ModelTemplate Updated model instance
	 */
	export const newRelationAction = async (model: ModelTemplate): Promise<ModelTemplate> => {
		console.clear();
		const usedClassProps = Models.usedClassProps(model);
		const relations: { relationName: string, relationType: string, relationship: string, key: string, model: string, required: boolean }[] = [];
		model.relations.find().forEach(relation => {
			relations.push({
				relationType: relation.type,
				relationName: relation.name,
				relationship: relation.relationship,
				model: relation.model,
				key: relation.key,
				required: relation.required
			});
		});
		const otherModels = Models.getExistingModels().filter(otherModel => otherModel !== model.name);
		while(true) {
			const { relationName, relationship, relationModel, required } = await Inqueirer.prompt([
				{
					name: "relationName",
					message: "Relation name: ",
					type: "input",
					validate: relationName => {
						const result = _.includes(usedClassProps, relationName);
						if (result) {
							return Chalk.red("Name already exists!");
						}
						return true;
					}
				},
				{
					name: "relationship",
					message: "Choose the relation type:",
					type: "list",
					choices: [
						{
							name: "Has One",
							value: "hasOne",
						},
						{
							name: "Has Many",
							value: "hasMany",
						},
						{
							name: "Belongs To",
							value: "belongsTo",
						}
					],
					when: answer => answer.relationName
				},
				{
					name: "relationModel",
					type: "autocomplete",
					message: "Choose a model to relate:",
					source: (__, input) => {
						const choices = otherModels.map(model => ({
							name: model,
							value: model
						}));
						if (input) {
							return choices.filter(choice => choice.name.toLowerCase().includes(input.toLowerCase()));
						}
						return choices;
					},
					when: answer => answer.relationName
				},
				{
					name: "required",
					type: "confirm",
					message: "Is it required?",
					default: true,
					when: answer => answer.relationName
				}
			]);
			if (relationName === "") break;
			const relationModelKeys: Inqueirer.DistinctChoice<Inqueirer.ListChoiceMap<any>>[] = [];
			const relationModelInstance = ModelTemplate.render(
				readFileSync(
					`${commander.opts()['srcDir']}/${Models.generateFileName(relationModel)}.ts`
				).toString("utf8")
			);
			relationModelInstance.properties.find().forEach(property => {
				relationModelKeys.push({
					name: property.name,
					value: property.name
				});
			});
			const relation = await Inqueirer.prompt([
				{
					name: "key",
					message: "Relation model key:",
					type: "autocomplete",
					source: (__, input) => {
						if (input) {
							return _.filter(relationModelKeys, (action: any) => action.name.toLowerCase().includes(input.toLowerCase()));
						}
						return relationModelKeys;
					}
				}
			]);
			relations.push({
				relationName,
				relationship,
				relationType: relationship === "belongsTo" ? relationModelInstance.properties.find(relation.key)[0].type : relationship === "hasMany" ? "array" : "model",
				model: relationModel,
				key: relation.key,
				required
			});
			console.log();
		}
		const updatedModelInstance = new ModelTemplate({
			name: model.name,
			uri: model.URI,
			table: model.table,
			properties: model.properties.find(),
			relations: []
		});
		relations.forEach(relation => {
			const relat: Templates.Models.Relation = {
				type: relation.relationType as any,
				name: relation.relationName,
				relationship: relation.relationship as any,
				model: relation.model,
				key: relation.key,
				required: relation.required
			}
			updatedModelInstance.relations.add(relat);
		});
		const MODEL_ALREADY_EXIST = _.includes(Models.getExistingModels(), model.name);
		if (MODEL_ALREADY_EXIST) {
			gitter.commit(
				`refactor(models): adds relations to model '${model.name}'`,
				[`${commander.opts()['srcDir']}/${Models.generateFileName(model.name)}.ts`]
			);
		}
		return updatedModelInstance;
	}
	/**
	 * Prompt for update relation action
	 *
	 * @param model Model template instance
	 * @param relation Relation name
	 *
	 * @return ModelTemplate Updated model instance
	 */
	export const updateRelationAction = async (model: ModelTemplate, relation: string): Promise<ModelTemplate> => {
		const usedClassProps = Models.usedClassProps(model);
		const relationBeforeUpdate = model.relations.find(relation)[0];
		const relations: { relationName: string, relationType: string, relationship: string, key: string, model: string }[] = [];
		model.relations.find().forEach(relation => {
			relations.push({
				relationType: relation.type,
				relationName: relation.name,
				relationship: relation.relationship,
				model: relation.model,
				key: relation.key
			});
		});
		const otherModels = Models.getExistingModels().filter(otherModel => otherModel !== model.name);
		const { relationship, relationModel } = await Inqueirer.prompt([
			{
				name: "relationship",
				message: "Choose the relation type:",
				type: "list",
				choices: [
					{
						name: "Has One",
						value: "hasOne",
					},
					{
						name: "Has Many",
						value: "hasMany",
					},
					{
						name: "Belongs To",
						value: "belongsTo",
					}
				]
			},
			{
				name: "relationModel",
				type: "autocomplete",
				message: "Choose a model to relate:",
				source: (__, input) => {
					const choices = otherModels.map(model => ({
						name: model,
						value: model
					}));
					if (input) {
						return _.filter(choices, (model: any) => model.name.toLowerCase().includes(input.toLowerCase()));
					}
					return choices;
				}
			}
		]);
		const relationModelKeys: Inqueirer.DistinctChoice<Inqueirer.ListChoiceMap<any>>[] = [];
		const relationModelInstance = ModelTemplate.render(
			readFileSync(
				`${commander.opts()['srcDir']}/${Models.generateFileName(relationModel)}.ts`
			).toString("utf8")
		);
		relationModelInstance.properties.find().forEach(property => {
			relationModelKeys.push({
				name: property.name,
				value: property.name
			});
		});
		const relationUpdate = await Inqueirer.prompt([
			{
				name: "relationName",
				message: "Relation name: ",
				type: "input",
				default: relationBeforeUpdate.name,
				validate: relationName => {
					const result = _.includes(usedClassProps, relationName);
					if (result) {
						if (relationName !== relationBeforeUpdate.name)
							return Chalk.red("Relation name already exists!");
						else
							return true;
					}
					return result;
				}
			},
			{
				name: "key",
				message: "Relation model key:",
				type: "autocomplete",
				source: (__, input) => {
					const choices = relationModelKeys;
					if (input) {
						return _.filter(choices, (key: any) => key.name.toLowerCase().includes(input.toLowerCase()));
					}
					return choices;
				}
			},
			{
				name: "required",
				message: "Is it required?",
				type: "confirm",
				default: relationBeforeUpdate.required
			}
		]);
		const updatedRelation: Templates.Models.Relation = {
			name: relationUpdate.relationName ?? relation,
			relationship,
			type: relationship === "belongsTo" ? relationModelInstance.properties.find(relationUpdate.key)[0].type as any : relationship === "hasMany" ? "array" : "model",
			model: relationModel,
			key: relationUpdate.key,
			required: relationUpdate.required
		}
		const commitMessageExtraLines: string[] = [];
		if (relationBeforeUpdate.name !== updatedRelation.name) commitMessageExtraLines.push(`- changes name from '${relationBeforeUpdate.name}' to '${updatedRelation.name}'`);
		if (relationBeforeUpdate.key !== updatedRelation.key) commitMessageExtraLines.push(`- changes key`);
		if (relationBeforeUpdate.model !== updatedRelation.model) commitMessageExtraLines.push(`- changes model from '${relationBeforeUpdate.model}' to '${updatedRelation.model}'`);
		if (relationBeforeUpdate.relationship !== updatedRelation.relationship) commitMessageExtraLines.push(`- changes relationship from '${relationBeforeUpdate.relationship}' to '${updatedRelation.relationship}'`);
		if (relationBeforeUpdate.type !== updatedRelation.type) commitMessageExtraLines.push(`- changes type from '${relationBeforeUpdate.type}' to '${updatedRelation.type}'`);
		if (commitMessageExtraLines.length > 0) {
			gitter.commit(
				`refactor(models): updates relation '${relation}' in model '${model.name}'`,
				[`${commander.opts()['srcDir']}/${Models.generateFileName(model.name)}.ts`],
				commitMessageExtraLines
			);
		}
		model.relations.update(relation, updatedRelation);
		return model;
	}
}
