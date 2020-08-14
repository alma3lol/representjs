import { Booter, Types } from '..';
import { BindingKey } from '../core';


const ctx = Booter.getInstance().get(Types.Booter.Bindings.CORE_CONTEXT_KEY);

/**
 * Namespaced core injector
 */
export namespace Core {
	/**
	 * Inject booter into property
	 */
	export const booter = (): PropertyDecorator => {
		return (): PropertyDescriptor => {
			return {
				get: () => Booter.getInstance()
			}
		}
	}

	/**
	 * Inject a binding's value from the core context
	 * 
	 * @param key Binding's key
	 */
	export const binding = (key: string | BindingKey<Types.Context.Core.ContextType>): PropertyDecorator => {
		return (): PropertyDescriptor => {
			return {
				get: () => ctx.get(key)
			}
		}
	}
}