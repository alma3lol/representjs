import { Core } from '..';
import { BindingKey } from './bindingkey.core';

export abstract class Context {
	/**
	 * Map for storing bindings in the context
	 */
	protected _registery: Map<string, Core.Binding<any>> = new Map();
	/**
	 * Bind a key to value in the registery
	 * 
	 * @param key Binding's key
	 */
	bind = <T>(key: Core.BindingKey<T> | string): Core.Binding<T> => {
		const binding = new Core.Binding(key);
		this._registery.set(key.toString(), binding);
		return binding;
	}
	get = <T>(key: Core.BindingKey<T> | string): T => {
		const binding = this._registery.get(key.toString());
		if (binding === undefined) throw new Error(`No such key: '${key.toString()}'`);
		else return binding.value;
	}
	/**
	 * Whether the registery has a binding or not
	 * 
	 * @param key Binding's key
	 */
	has = <T>(key: Core.BindingKey<T> | string) => this._registery.has(key.toString());
	/**
	 * Unbind a key from the registery
	 * 
	 * @param key Binding's key
	 */
	unbind = <T>(key: Core.BindingKey<T> | string) => this._registery.delete(key.toString());
	/**
	 * Return context's name
	 */
	abstract get name(): string;
}