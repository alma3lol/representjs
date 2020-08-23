import { Types, Core } from '..';
import { Serializable } from './serializable.core';

export class Model<T extends Model<T>> extends Serializable {
	protected static _registery: Map<string, { [name: string]: Core.Binding.Value<any> }> = new Map();
	static bind<T>(name: string, key: Core.Binding.Key<T> | string): Core.Binding.Value<T> {
		const binding = new Core.Binding.Value(key);
		const data = this._registery.get(name) ?? {};
		data[key.toString()] = binding;
		this._registery.set(name, data);
		return binding;
	}
	static get(name: string): { [name: string]: Core.Binding.Value<any> } {
		return this._registery.get(name) as any;
	}
	static getSubKey<T>(name: string, key: Core.Binding.Key<T> | string): Core.Binding.Value<T> | undefined {
		const data = this._registery.get(name) as any;
		if (data === undefined) return undefined;
		return data[key.toString()];
	}
	[name: string]: any;
	constructor(data?: Partial<T>) {
		super();
		Object.assign(this, data)
	}
	get ID() {
		return this[Model.getSubKey(this.Name, Types.Bindings.Model.ID_PROPERTY_KEY)?.value ?? "id"];
	}
	static getName() {
		return this.name;
	}
	get Name() {
		return this.constructor.name;
	}
	get Table() {
		return Model.getSubKey(this.Name, Types.Bindings.Model.TABLE_KEY)?.value;
	}
	get URI() {
		return Model.getSubKey(this.Name, Types.Bindings.Model.URI_KEY)?.value;
	}
	static serialize<T extends Model<T>>(data: Partial<T>) {
		return this.prototype.serialize(data, this);
	}
}