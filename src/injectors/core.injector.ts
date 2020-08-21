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
	 * Inject a binding's value from the booter
	 * 
	 * @param key Binding's key
	 */
	export const binding = <T>(key: string | Binding.Key<T>): PropertyDecorator => {
		return (): PropertyDescriptor => {
			return {
				get: () => Booter.getInstance().get(key)
			}
		}
	}
}