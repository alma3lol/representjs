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
		Utils.Reflector.defineMetadata(Types.Bindings.Datasource.NAME_KEY.toString(), config.name, target);
		Utils.Reflector.defineMetadata(Types.Bindings.Datasource.CONFIG_FILENAME_KEY.toString(), config.configFilename, target);
	}
}