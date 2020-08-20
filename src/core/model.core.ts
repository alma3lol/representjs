import { Utils, Types } from '..';
import { Serializable } from './serializable.core';

export class Model<T extends Model<T>> extends Serializable {
	[name: string]: any;
	constructor(data?: Partial<T>) {
		super();
		Object.assign(this, data)
	}
	get ID() {
		return this[Utils.Decorator.Reflector.getMetadata(Types.Context.Model.Bindings.ID_PROPERTY_KEY.toString(), this)];
	}
	static getName() {
		return Utils.Decorator.Reflector.getMetadata(Types.Context.Model.Bindings.NAME_KEY.toString(), this);
	}
	static getTable() {
		return Utils.Decorator.Reflector.getMetadata(Types.Context.Model.Bindings.TABLE_KEY.toString(), this);
	}
	static getURI() {
		return Utils.Decorator.Reflector.getMetadata(Types.Context.Model.Bindings.URI_KEY.toString(), this);
	}
	static serialize<T extends Model<T>>(data: Partial<T>) {
		return this.prototype.serialize(data, this);
	}
}