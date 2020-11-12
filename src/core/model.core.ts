import { Types, Core, Utils } from '..';

export class Model<T extends Model<T>> {
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
		Object.assign(this, data);
		if (data) {
			const properties = Model.getSubKey(this.ModelName, Types.Bindings.Model.PROPERTIES_KEY)?.value ?? [];
			const id_property = Model.getSubKey(this.ModelName, Types.Bindings.Model.ID_PROPERTY_KEY)?.value;
			if (id_property) properties.push(id_property);
			properties.forEach(property => this[property] = data[property]);
		}
	}
	get ID_PROPERTY() {
		const idProperty = Model.getSubKey(this.ModelName, Types.Bindings.Model.ID_PROPERTY_KEY)?.value;
		if (idProperty === undefined) throw new Error("NO ID PROPERTY ASSIGNED ON CLASS");
		else return this[idProperty];
	}
	static getName() {
		return this.name;
	}
	get ModelName() {
		return this.constructor.name;
	}
	get ModelTable() {
		return Model.getSubKey(this.ModelName, Types.Bindings.Model.TABLE_KEY)?.value as string;
	}
	get ModelURI() {
		return Model.getSubKey(this.ModelName, Types.Bindings.Model.URI_KEY)?.value as string;
	}
	static getTable() {
		return Model.getSubKey(this.name, Types.Bindings.Model.TABLE_KEY)?.value as string;
	}
	static getURI() {
		return Model.getSubKey(this.name, Types.Bindings.Model.URI_KEY)?.value as string;
	}
	/**
	 * Convert model to JSON object
	 */
	toJSON = () => JSON.parse(JSON.stringify(this.toObject()));
	/**
	 * Convert model to JSON string
	 */
	toString = () => JSON.stringify(this.toObject());
	/**
	 * Convert model to Object
	 */
	toObject = (): Object => {
		const properties = Model.getSubKey(this.ModelName, Types.Bindings.Model.PROPERTIES_KEY)?.value ?? [];
		const id_property = Model.getSubKey(this.ModelName, Types.Bindings.Model.ID_PROPERTY_KEY)?.value;
		if (id_property) properties.push(id_property);
		const data: any = {};
		properties.forEach(property => data[property] = this[property]);
		return data
	}
}