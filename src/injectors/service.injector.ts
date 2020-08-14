import { Core, Types, Booter, Context, Datasources } from '..';
import { AxiosRequestConfig } from 'axios';

/**
 * Services injector
 * 
 * @param ds Datasource's class
 * @param config AxiosRequestConfig to pass to the Datasources.API instance
 */
export const service = (ds: Types.Common.Class<Datasources.API>, config?: AxiosRequestConfig): PropertyDecorator => {
	return (): PropertyDescriptor => ({
		get: () => new Core.Service<any>(new ds(config))
	})
}