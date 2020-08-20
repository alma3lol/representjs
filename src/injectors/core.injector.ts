import { Types } from '..';
import { Binding } from '../core';
import { Booter } from "../booter";



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
	export const binding = (key: string | Binding.Key<Types.Context.Core.ContextType>): PropertyDecorator => {
		const ctx = Booter.getInstance().get(Types.Booter.Bindings.CORE_CONTEXT_KEY);
		return (): PropertyDescriptor => {
			return {
				get: () => ctx.get(key)
			}
		}
	}
}