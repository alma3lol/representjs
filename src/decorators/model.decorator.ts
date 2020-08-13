import { Utils, Types } from '..';
import { v4 as uuidv4 } from "uuid";

/**
 * Default model decorator. Uses [Model.config](#Model.config)
 * 
 * @param config Model's configuration
 */
export const model = (config?: Types.Core.Model.Config): ClassDecorator => Model.config(config);

/**
 * A namespaced model decorators
 */
export namespace Model {
	/**
	 * Set model's configuration
	 * 
	 * @param config Model's configuration
	 */
	export const config = (config?: Types.Core.Model.Config): ClassDecorator => {
		return (
			target
		) => {
			if (config !== undefined) {
				if (config.table !== undefined)
					Utils.Decorator.Reflector.defineMetadata(Types.Context.Model.Bindings.TABLE_KEY.toString(), config.table, target);
				if (config.name !== undefined)
					Utils.Decorator.Reflector.defineMetadata(Types.Context.Model.Bindings.NAME_KEY.toString(), config.name, target);
				if (config.uri !== undefined)
					Utils.Decorator.Reflector.defineMetadata(Types.Context.Model.Bindings.URI_KEY.toString(), config.uri, target);
			}
		}
	}

	/**
	 * Decorate a model's property
	 * 
	 * @param config Property configuration
	 */
	export const property = (config?: Types.Core.Model.PropertyConfig): PropertyDecorator => {
		return (
			target,
			propertyKey
		): any => {
			if (config !== undefined) {
				if (config.id !== undefined && config.id === true)
					Utils.Decorator.Reflector.defineMetadata(Types.Context.Model.Bindings.ID_PROPERTY_KEY.toString(), propertyKey, target)
				if (config.defaultFn !== undefined || config.default !== undefined) {
					let val = (config.default !== undefined) ? config.default : uuidv4();
					const descriptor: PropertyDescriptor = {
						configurable: true,
						enumerable: true,
						get: () => val,
						set: (v) => val = v
					}
					return descriptor
				}
			}
		}
	}
}