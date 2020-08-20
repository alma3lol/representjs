import { Types, Datasources, Core } from '..';
import { DexieOptions } from 'dexie';

/**
 * Repository injector
 * 
 * @param ds Repository's datasource
 * @param config Datasource's config
 * @param options Dexie datasource options
 */
export const repository = (ds: Types.Common.Class<Datasources.Dexie>, config: Types.Datasources.Database.Config, options?: DexieOptions): PropertyDecorator => {
	return (): PropertyDescriptor => ({
		get: () => new Core.Repository(new ds(config, options))
	})
}