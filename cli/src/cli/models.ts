import { unlinkSync, writeFileSync, readFileSync } from 'fs';
import glob from 'glob';
import _ from 'lodash';
import { commander } from './commander';
import {ModelTemplate} from '../templates';
import {Reference} from './references';

export namespace Models {
	/**
	 * Generate a file name from model name
	 *
	 * @param name Model name
	 *
	 * @return string
	 */
	export const generateFileName = (name: string) => {
		return _.join(
			name.split(
				/(?=[A-Z])/
			).map(
				part => part.toLowerCase()
			),
			"-"
		) + `.model`;
	}
	/**
	 * Generate a table name from model name
	 *
	 * @param name Model name
	 *
	 * @return string
	 */
	export const generateTableName = (name: string) => {
		return _.join(
			name.split(
				/(?=[A-Z])/
			).map(
				part => part.toLowerCase()
			),
			"_"
		);
	}
	/**
	 * Renders a list of already existing models
	 *
	 * @return string[]
	 */
	export const renderModelsList = (files: string[]) => {
		const models: string[] = [];
		files.forEach(file => {
			models.push(
				_.startCase(_.toLower(file.split(".")[0])).replace(/\s/g, "")
			);
		});
		return models;
	}
	/**
	 * Shows a list of existing models
	 */
	export const getExistingModels = () => {
		let files: string[] = [];
		const matches = glob.sync(`${commander.opts()["srcDir"]}/*.model.ts`);
		matches.forEach(file => {
			files.push(_.last(file.split("/")) ?? "");
		});
		const modelsList = renderModelsList(files);
		return modelsList;
	}
	/**
	 * Deletes a model
	 */
	export const deleteModel = (name: string) => {
		unlinkSync(`${commander.opts()['srcDir']}/${generateFileName(name)}.ts`);
	}
	/**
	 * Appends a model to index
	 *
	 * @param indexContent Index file content
	 * @param name Model name
	 *
	 * @return string The new index file content
	 */
	export const appendModelToIndex = (indexContent: string, name: string) => {
		const modelFileName = generateFileName(name);
		const modelMatcher = `export \* from './${modelFileName}';`;
		if (indexContent === "") return modelMatcher;
		if (!indexContent.includes(modelMatcher)) {
			return _.join([indexContent.trim(), modelMatcher], "\n");
		};
		return indexContent;
	}
	/**
	 * Removes a model from index
	 *
	 * @param indexContent Index file content
	 * @param name Model name
	 *
	 * @return string The new index file content
	 */
	export const removeModelFromIndex = (indexContent: string, name: string) => {
		const modelFileName = generateFileName(name);
		if (indexContent === "") return '';
		const modelMatcher = `export * from './${modelFileName}';`;
		if (indexContent.includes(modelMatcher)) {
			return _.join(indexContent.replace(modelMatcher, '').trim().split(/[\r\n]+/), "\n");
		};
		return indexContent;
	}
	/**
	 * Write index file content
	 */
	export const writeIndex = (indexContent: string) => {
		writeFileSync(`${commander.opts()['srcDir']}/index.ts`, indexContent);
	}
	/**
	 * Return all used property/relation name to avoid repeating them
	 *
	 * @param model Model template class
	 *
	 * @return Array
	 */
	export const usedClassProps = (model: ModelTemplate) => {
		const usedClassProps: string[] = [];
		model.properties.find().forEach(property => usedClassProps.push(property.name));
		model.relations.find().forEach(relation => usedClassProps.push(relation.name));
		return _.uniq(usedClassProps);
	}
	/**
	 * Finds all model's references
	 *
	 * @param model Model to find references for
	 *
	 * @return array Array of references
	 */
	export const findAllReferences = (model: ModelTemplate) => {
		const references: Reference[] = [];
		getExistingModels().forEach(existingModelName => {
			if (existingModelName !== model.name) {
				const existingModelPath = `${commander.opts()['srcDir']}/${generateFileName(existingModelName)}.ts`;
				const existingModelContent = readFileSync(existingModelPath).toString("utf8");
				const existingModel = ModelTemplate.render(existingModelContent);
				existingModel.relations.find().forEach(relation => {
					if (relation.model === model.name) {
						references.push(new Reference(existingModel, relation));
					}
				});
			}
		});
		return references;
	}
}
