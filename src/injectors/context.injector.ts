import { Booter, Types } from '..';

/**
 * Inject a context into a property
 * 
 * @param key Context's class or key
 */
export const context = (
	key: Types.Injectors.Context.ContextKeys
): PropertyDecorator => {
	let context = Booter.getInstance().get(key.key());
	return (): PropertyDescriptor => ({
		get: () => context
	})
}