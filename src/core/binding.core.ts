import { Types } from '..';

export namespace Binding {
	/**
	 * Binding key class.
	 * 
	 * Used to force type bindings
	 */
	export class Key<ValueType> {
		constructor(
			public readonly key: string
		) { }
		toString() { return this.key; }
	}
	/**
	 * Binding value class
	 */
	export class Value<T> {
		/**
		 * Value to be bound
		 */
		private _value: T | Types.Common.Class<T>;
		constructor(
			public readonly key: Key<T> | string
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
}