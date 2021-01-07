import _ from 'lodash';
import { Templates } from '../types';
import { Models } from '../cli';

type Props = {
	/**
	 * Model name
	 */
	name: string
	/**
	 * Model uri
	 */
	uri: string
	/**
	 * Model table
	 */
	table: string
	/**
	 * Model properties
	 */
	properties: Templates.Models.Property[]
	/**
	 * Model relations
	 */
	relations: Templates.Models.Relation[]
}

export class ModelTemplate {
	constructor(protected _props: Props) { }
	/**
	 * Model name
	 */
	public get name() {
		return this._props.name;
	}
	public set name(name: string) {
		this._props.name = name;
	}
	/**
	 * Model URI
	 */
	public get URI() {
		return this._props.uri;
	}
	public set URI(uri: string) {
		this._props.uri = uri;
	}
	/**
	 * Model table
	 */
	public get table() {
		return this._props.table;
	}
	public set table(table: string) {
		this._props.table = table;
	}
	/**
	 * Properties array
	 */
	properties = {
		/**
		 * Add a property
		 */
		add: (property: Templates.Models.Property) => {
			this._props.properties.push(property);
		},
		/**
		 * Find a property or return all
		 */
		find: (name?: string) => {
			if (name) {
				const property = _.find(this._props.properties, { name });
				return property ? [property] : [];
			}
			return this._props.properties;
		},
		/**
		 * Update a property
		 */
		update: (name: string, property: Templates.Models.Property) => {
			const propertyIndex = _.findIndex(this._props.properties, { name });
			this.properties.remove(name);
			this._props.properties.splice(0, propertyIndex, property);
		},
		/**
		 * Remove a property
		 */
		remove: (name: string) => {
			_.remove(this._props.properties, { name });
		}
	}
	/**
	 * Relations array
	 */
	relations = {
		/**
		 * Add a relation
		 */
		add: (relation: Templates.Models.Relation) => {
			this._props.relations.push(relation);
		},
		/**
		 * Find a relation or return all
		 */
		find: (name?: string) => {
			if (name) {
				const relation = _.find(this._props.relations, { name });
				return relation ? [relation] : [];
			}
			return this._props.relations;
		},
		/**
		 * Update a relation
		 */
		update: (name: string, relation: Templates.Models.Relation) => {
			const relationIndex = _.findIndex(this._props.relations, { name });
			this.relations.remove(name);
			this._props.relations.splice(0, relationIndex, relation);
		},
		/**
		 * Remove a relation
		 */
		remove: (name: string) => {
			_.remove(this._props.relations, { name });
		}
	}
	/**
	 * Generate template
	 *
	 * @return string
	 */
	generate = () => {
		const { name, uri, table, properties, relations } = this._props;
		let relationsImports: string[] = [];
		relations.map(relation => relationsImports.push(relation.model));
		relationsImports = _.uniq(relationsImports);
		return `import { Core, Decorators } from '@alma3lol/represent';
${
	_.join(
		relationsImports.map(relation => `import { ${relation} } from './${Models.generateFileName(relation)}';`),
		"\n"
	)
}

export interface ${_.startCase(name).replace(/\s/g, "")}Props {
	${
		_.join(
			properties.map(prop => `${prop.name}${prop.required ? "" : "?"}: ${prop.type === "string" ? "string" : prop.type === "boolean" ? "boolean" : prop.type === "number" ? "number" : prop.type === "array" ? `${prop.arrType}[]` : "{}"}`),
		"\n\t"
		)
		
	}
}

export interface ${_.startCase(name).replace(/\s/g, "")}Relations {${
	relations.length > 0 ? `\n\t${
		_.join(
			relations.map(
				relation => `${relation.name}${relation.required ? "" : "?"}: ${relation.relationship === "belongsTo" ? relation.type : relation.model}${relation.relationship === "hasMany" ? "[]" : ""}`
			),
			"\n\t"
		)
	}\n`: ''
}}

@Decorators.model({
	uri: '${uri}',
	table: '${table}'
})
export class ${_.startCase(name).replace(/\s/g, "")} extends Core.Model<${_.startCase(name).replace(/\s/g, "")}> {
	constructor(data: ${_.startCase(name).replace(/\s/g, "")}Props) {
		super(data);
		Object.assign(this, data);
	}
	${
		_.join(
			properties.map(prop => {
				let propertyConfig = "";
				if (prop.defaultValue || prop.id) {
					const configArr: string[] = [];
					if (prop.id) configArr.push(`type: ${prop.type === "string" ? "String" : prop.type === "number" ? "Number" : prop.type === "boolean" ? "Boolean" : prop.type === "array" ? `${prop.arrType}[]` : "{}"}`);
					if (prop.defaultValue) configArr.push(`default: ${
						prop.type === "string" ? `'${prop.defaultValue}'` : prop.defaultValue
					}`);
					propertyConfig = `{\n\t\t${_.join(configArr, "\n\t\t")}\n\t}`;
				}
				return `@Decorators.Model.${prop.id ? "ID" : "property"}(${propertyConfig})\n\t${prop.name}${prop.required ? "!" : "?"}: ${prop.type === "string" ? "string" : prop.type === "number" ? "number" : prop.type === "boolean" ? "boolean" : prop.type === "array" ? `${prop.arrType}[]` : "{}"};`
			}),
			"\n\t"
		)
	}${
		relations.length > 0 ? `\n\t${
			_.join(
				relations.map(relation => {
					const relationConfig = [
						`cls: ${relation.model},`,
						`key: '${relation.key}'`
					];
					return `@Decorators.ORM.Relation.${relation.relationship}({\n\t\t${_.join(relationConfig, "\n\t\t")}\n\t})\n\t${relation.name}${relation.required ? "!" : "?"}: ${relation.relationship === "hasMany" ? `${relation.model}[]` : relation.relationship === "hasOne" ? relation.model : relation.type};`;
				}),
				"\n\t"
			)
		}` : ''
	}
}`
	}
	/**
	 * Render template string into model
	 *
	 * @param template Template string
	 *
	 * @return ModelTemplate
	 */
	static render = (template: string) => {
		const nameMatch = template.match(/export class (.*?) e/);
		const name = nameMatch !== null ? nameMatch[1] : "";
		const uriMatch = template.match(/uri: ['"](.*?)['"]/);
		const uri = uriMatch !== null ? uriMatch[1] : "";
		const tableMatch = template.match(/table: ['"](.*?)['"]/);
		const table = tableMatch !== null ? tableMatch[1] : "";
		const idPropertyMatch = template.match(/\@Decorators\.Model\.ID\({[\r\n \t]+type: .*[\r\n \t]+}\)[\r\n \t]+(.*)(\?|!): (.*);/);
		const properties: Templates.Models.Property[] = [];
		if (idPropertyMatch) {
			const idPropertyType = idPropertyMatch[3] as any;
			let type = idPropertyType
			const prop: Templates.Models.Property = {
				name: idPropertyMatch[1],
				type,
				id: true
			}
			if (/\[\]/.test(idPropertyType)) {
				const typeMatch = idPropertyType.match(/(.*)\[\]/);
				prop.type = "array";
				prop.arrType = typeMatch[1];
			}
			if (idPropertyMatch[2] === "!") prop.required = true;
			properties.push(prop);
		}
		const propertiesMatch = template.matchAll(/\@Decorators\.Model\.property\({?[\r\n \t]*(.*)[\r\n \t]*}?\)[\r\n \t]+(.*)(\?|!): (.*);/g);
		const propertiesArr = [...propertiesMatch];
		properties.push(
			...propertiesArr.map(property => {
				const propertyType = property[4] as any;
				let type = propertyType;
				const prop: Templates.Models.Property = {
					name: property[2],
					type
				}
				if (/default: (.*),?/.test(property[1])) {
					const defaultValueMatch = property[1].match(/default: (.*),?/);
					prop.defaultValue = defaultValueMatch ? defaultValueMatch[1] : undefined;
				}
				if (/\[\]/.test(propertyType)) {
					const typeMatch = propertyType.match(/(.*)\[\]/);
					prop.type = "array";
					prop.arrType = typeMatch[1];
				}
				if (property[3] === "!") prop.required = true;
				return prop;
			})
		);
		const relationsMatch = template.matchAll(/\@Decorators\.ORM\.Relation\.(hasOne|hasMany|belongsTo)\({([\r\n \t]+.*['"]?,?[\r\n \t]+)+}\)[\r\n \t]+(.*);/g);
		const relationsArr = [...relationsMatch];
		const relations: Templates.Models.Relation[] = [];
		relationsArr.forEach(relation => {
			const modelMatches = relation[0].matchAll(/[\r\n \t]+(cls): ([^,]*),?/g);
			const keyMatches = relation[0].matchAll(/[\r\n \t]+(key): ['"](.*)['"],?/g);
			const propertyMatches = relation[0].matchAll(/[ \t]+(.*)([!?]): ([^;]*)/g);
			if (modelMatches && keyMatches && propertyMatches) {
				const propertyMatch = [...propertyMatches][0];
				const model = [...modelMatches][0][2];
				const key = [...keyMatches][0][2];
				const relat: Templates.Models.Relation = {
					name: propertyMatch[1] as any,
					model,
					key,
					relationship: relation[1] as any,
					type: relation[1] === "hasMany" ? "array" : relation[1] === "hasOne" ? "model"  : propertyMatch[3] as any,
					required: propertyMatch[2] === "!"
				}
				relations.push(relat);
			}
		});
		return new ModelTemplate({
			name,
			uri,
			table,
			properties,
			relations
		});
	}
}
