import { Core } from '..';

export abstract class Context {
	/**
	 * A store of bindings in the context
	 */
	protected _registery: Map<string, Core.Binding.Value<any>> = new Map();
	/**
	 * Bind a key to value in the registery
	 * 
	 * @param key Binding's key
	 */
	bind = <T>(key: Core.Binding.Key<T> | string): Core.Binding.Value<T> => {
		const binding = new Core.Binding.Value(key);
		this._registery.set(key.toString(), binding);
		return binding;
	}
	/**
	 * Get a binding by key
	 * 
	 * @param key Binding's key
	 */
	get = <T>(key: Core.Binding.Key<T> | string): T => {
		const binding = this._registery.get(key.toString());
		if (binding === undefined) throw new Error(`No such key: '${key.toString()}'`);
		else return binding.value;
	}
	/**
	 * Whether the registery has a binding or not
	 * 
	 * @param key Binding's key
	 */
	has = <T>(key: Core.Binding.Key<T> | string) => this._registery.has(key.toString());
	/**
	 * Unbind a key from the registery
	 * 
	 * @param key Binding's key
	 */
	unbind = <T>(key: Core.Binding.Key<T> | string) => this._registery.delete(key.toString());
	/**
	 * Return context's key
	 */
	static key<T>(): Core.Binding.Key<T> { return new Core.Binding.Key("CONTEXT"); };
}