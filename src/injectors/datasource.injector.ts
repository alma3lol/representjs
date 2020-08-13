import { Core, Types } from '..';

/**
 * Datasources injector
 * 
 * @param cls Datasource's class
 */
export const datasource = (cls: Types.Common.Class<Core.Datasource>) => Core.Injector.createClassInjector(cls);