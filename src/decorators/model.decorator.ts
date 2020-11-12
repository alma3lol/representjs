import { Types, Core, Booter, Utils } from '..';

/**
 * Default model decorator. Uses [Model.config](#Model.config)
 * 
 * @param config Model's configuration
 */
export const model = <T extends Core.Model<T>>(config: Types.CoreType.Model.Config) => Model.config(config);

/**
 * A namespaced model decorators
 */
export namespace Model {
	/**
	 * Set model's configuration
	 * 
	 * @param config Model's configuration
	 */
	export const config = <T extends Core.Model<T>>(config: Types.CoreType.Model.Config) => {
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

	export const ID = <T extends Core.Model<T>>(config: Types.CoreType.Model.PropertyConfig & { type: Function }): PropertyDecorator => {
		return (
			target,
			propertyKey
		): any => {
			Core.Model.bind(target.constructor.name, Types.Bindings.Model.ID_PROPERTY_KEY).to(propertyKey.toString());
			Core.Model.bind(target.constructor.name, Types.Bindings.Model.ID_PROPERTY_TYPE_KEY).to(config.type);
			if (config.default !== undefined) {
				let defaultValue = config.default;
				return {
					get: () => defaultValue,
					set: (value: any) => { if (value !== undefined) defaultValue = value }
				}
			}
		}
	}

	/**
	 * Decorate a model's property
	 * 
	 * @param config Property configuration
	 */
	export const property = <T extends Core.Model<T>>(config?: Types.CoreType.Model.PropertyConfig) => {
		return (
			target: T,
			propertyKey: string
		): any => {
			if (config !== undefined) {
				if (config.default !== undefined) {
					let defaultValue = config.default;
					return {
						get: () => defaultValue,
						set: (value: any) => { if (value !== undefined) defaultValue = value }
					}
				}
			} else {
				const properties: string[] = Core.Model.getSubKey(target.ModelName, Types.Bindings.Model.PROPERTIES_KEY)?.value ?? [];
				if (!properties.includes(propertyKey.toString())) properties.push(propertyKey.toString());
				Core.Model.bind(target.ModelName, Types.Bindings.Model.PROPERTIES_KEY).to(properties);
				let defaultValue: any;
				return {
					get: () => defaultValue,
					set: (value: any) => { if (value !== undefined) defaultValue = value }
				}
			}
		}
	}
}