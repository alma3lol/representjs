import { Types, Utils } from '..';

/**
 * Datasource's decorator
 * 
 * @param config Datasource's configuration
 */
export const datasource = (config: Types.Core.Datasource.Config): ClassDecorator => {
	return (
		target
	) => {
		Utils.Decorator.Reflector.defineMetadata(Types.Context.Datasource.Bindings.NAME_KEY.toString(), config.name, target);
		Utils.Decorator.Reflector.defineMetadata(Types.Context.Datasource.Bindings.CONFIG_FILENAME_KEY.toString(), config.configFilename, target);
	}
}