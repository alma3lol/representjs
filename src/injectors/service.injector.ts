import { Core, Types, Booter, Context } from '..';

/**
 * Services injector
 * 
 * @param cls Service's class
 */
export const service = (cls: Types.Common.Class<Core.Service>) => Core.Injector.createClassInjector(cls);