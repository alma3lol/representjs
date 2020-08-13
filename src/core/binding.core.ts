import { BindingKey } from './bindingkey.core';
import { Types } from '..';

/**
 * Binding class to contain a key's value
 */
export class Binding<T> {
	/**
	 * Value to be bound
	 */
	private _value: T | Types.Common.Class<T>;
	constructor(
		public readonly key: BindingKey<T> | string
	) { }
	/**
	 * Check wether the given value is a class or an instance
	 * 
	 * @param value Value to check
	 */
	private isClass = (value: T | Types.Common.Class<T>): value is Types.Common.Class<T> => (value instanceof Function);
	/**
	 * Bind to a value
	 * 
	 * @param value Value to bound
	 */
	to(value: T) {
		this._value = value;
		return this;
	}
	/**
	 * Bind to class value
	 * 
	 * @param cls Class value to bound
	 */
	toClass(cls: Types.Common.Class<T>) {
		this._value = cls;
		return this;
	}
	/**
	 * Value of the binding
	 */
	get value() {
		if (this.isClass(this._value)) return new this._value();
		else return this._value;
	}
}