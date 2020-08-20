import { Utils, Types } from '..';
import { Serializable } from './serializable.core';

export class Model<T extends Model<T>> extends Serializable {
	[name: string]: any;
	constructor(data?: Partial<T>) {
		super();
		Object.assign(this, data)
	}
	get ID() {
		return this[Utils.Reflector.getMetadata(Types.Bindings.Model.ID_PROPERTY_KEY.toString(), this)];
	}
	static getName() {
		return Utils.Reflector.getMetadata(Types.Bindings.Model.NAME_KEY.toString(), this);
	}
	static getTable() {
		return Utils.Reflector.getMetadata(Types.Bindings.Model.TABLE_KEY.toString(), this);
	}
	static getURI() {
		return Utils.Reflector.getMetadata(Types.Bindings.Model.URI_KEY.toString(), this);
	}
	static serialize<T extends Model<T>>(data: Partial<T>) {
		return this.prototype.serialize(data, this);
	}
}