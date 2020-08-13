import { Core, Types } from '..';

/**
 * Repositories injector
 * 
 * @param cls Repository's class
 */
export const repository = (cls: Types.Common.Class<Core.Repository>) => Core.Injector.createClassInjector(cls);