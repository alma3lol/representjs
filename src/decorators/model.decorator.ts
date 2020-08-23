import { Types, Core, Booter } from '..';
import { v4 as uuidv4 } from "uuid";

/**
 * Default model decorator. Uses [Model.config](#Model.config)
 * 
 * @param config Model's configuration
 */
export const model = <T extends Core.Model<T>>(config: Types.Core.Model.Config) => Model.config(config);

/**
 * A namespaced model decorators
 */
export namespace Model {
	/**
	 * Set model's configuration
	 * 
	 * @param config Model's configuration
	 */
	export const config = <T extends Core.Model<T>>(config: Types.Core.Model.Config) => {
		return (
			target: Types.Common.Class<T>
		) => {
			Core.Model.bind(target.name, Types.Bindings.Model.TABLE_KEY).to(config.table);
			Core.Model.bind(target.name, Types.Bindings.Model.URI_KEY).to(config.uri);
			const models = Booter.getInstance().get(Types.Bindings.Core.MODELS_KEY);
			models.push(target);
			Booter.getInstance().bind(Types.Bindings.Core.MODELS_KEY).to(models);
		}
	}

	export const ID = (config: Types.Core.Model.PropertyConfig & { type: Function }): PropertyDecorator => {
		return (
			target,
			propertyKey
		) => {
			Core.Model.bind(target.constructor.name, Types.Bindings.Model.ID_PROPERTY_KEY).to(propertyKey.toString());
			Core.Model.bind(target.constructor.name, Types.Bindings.Model.ID_PROPERTY_TYPE_KEY).to(config.type);
			if (config.defaultFn !== undefined || config.default !== undefined) {
				let val = (config.default !== undefined) ? config.default : uuidv4();
				const descriptor: PropertyDescriptor = {
					get: () => val,
					set: (v) => val = v
				}
				return descriptor;
			}
		}
	}

	/**
	 * Decorate a model's property
	 * 
	 * @param config Property configuration
	 */
	export const property = <T extends Core.Model<T>>(config?: Types.Core.Model.PropertyConfig) => {
		return (
			target: T,
			propertyKey: string
		): any => {
			if (config !== undefined) {
				if (config.defaultFn !== undefined || config.default !== undefined) {
					let val = (config.default !== undefined) ? config.default : uuidv4();
					const descriptor: PropertyDescriptor = {
						get: () => val,
						set: (v) => val = v
					}
					return descriptor;
				}
			} else {
				const properties: string[] = Core.Model.getSubKey(target.Name, Types.Bindings.Model.PROPERTIES_KEY)?.value ?? [];
				if (!properties.includes(propertyKey.toString())) properties.push(propertyKey.toString());
				Core.Model.bind(target.Name, Types.Bindings.Model.PROPERTIES_KEY).to(properties);
			}
		}
	}
}