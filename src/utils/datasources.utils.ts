import { Types } from '..';
import { Model } from '../core';
import 'reflect-metadata';

export namespace Datasources {
	export const generateDexieStore = <T extends Model<T>>(model: T | Types.Common.Class<T>): { [tableName: string]: string } => {
		let store: { [tableName: string]: string } = {};
		if (model instanceof Model) {
			if (model.Table) {
				let schema = "";
				if (typeof model.ID === "number") schema = "++";
				else schema = "&";
				schema += Model.getSubKey(model.Name, Types.Bindings.Model.ID_PROPERTY_KEY)?.value;
				const properties = Model.getSubKey(model.Name, Types.Bindings.Model.PROPERTIES_KEY)?.value ?? [];
				properties.forEach(property => schema += `,${property}`);
				store[model.Table] = schema;
			}
		} else {
			const table = Model.getSubKey(model.name, Types.Bindings.Model.TABLE_KEY)?.value
			if (table) {
				let schema = "";
				const id = Model.getSubKey(model.name, Types.Bindings.Model.ID_PROPERTY_KEY)?.value ?? ""
				const type = Model.getSubKey(model.name, Types.Bindings.Model.ID_PROPERTY_TYPE_KEY)?.value;
				if (type instanceof Number) schema = "++";
				else schema = "&";
				schema += id;
				const properties = Model.getSubKey(model.name, Types.Bindings.Model.PROPERTIES_KEY)?.value ?? [];
				properties.forEach(property => schema += `,${property}`);
				store[table] = schema;
			}
		}
		return store;
	}
}