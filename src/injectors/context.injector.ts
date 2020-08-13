import { Types, Booter } from '..';

/**
 * Inject a context into a property
 * 
 * @param ctx Context's class
 */
export const context = (
	ctx: Types.Common.Class<Types.Injectors.Core.ContextTypes>
): PropertyDecorator => {
	let context = Booter.getInstance().get(new ctx().name);
	return (): PropertyDescriptor => ({
		get: () => context
	})
}