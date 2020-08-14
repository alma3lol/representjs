import { Types } from '..';

export class Serializable {
	/**
	 * Serializes data into an instance of the class
	 * 
	 * @param data Data to serialize
	 */
	readonly serialize = <T>(data: Partial<T>, cls: Types.Common.Class<T>) => new cls(data);
	readonly toJSON = () => JSON.stringify(this);
	toString() { return this.toJSON(); }
}