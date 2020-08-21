import { Core, Types } from '..';

/**
 * Models injector
 * 
 * @param cls Model's class
 */
export const model = <T extends Core.Model<T>>(cls: Types.Common.Class<T>) => Core.Injector.createClassInjector(cls);