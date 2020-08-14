import { Booter, Core } from '..';

/**
 * Inject a context into a property
 * 
 * @param cls Context's class
 */
export const context = (
	cls: typeof Core.Context
): PropertyDecorator => {
	let context = Booter.getInstance().get(cls.key());
	return (): PropertyDescriptor => ({
		get: () => context
	})
}