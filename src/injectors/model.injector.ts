import { Core, Types } from '..';

/**
 * Models injector
 * 
 * @param cls Model's class
 */
export const model = (cls: Types.Common.Class<typeof Core.Model>) => Core.Injector.createClassInjector(cls);