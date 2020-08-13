/**
 * Binding key class.
 * 
 * Used to force type bindings
 */
export class BindingKey<ValueType> {
	constructor(
		public readonly key: string
	) { }
	toString() { return this.key; }
}