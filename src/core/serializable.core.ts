import { Types } from '..';

export class Serializable<T> {
	/**
	 * Serializes data into an instance of the class
	 * 
	 * @param data Data to serialize
	 */
	serialize(data: Partial<T>, cls: Types.Common.Class<T>) {
		return new cls(data);
	}
	toJSON = () => JSON.stringify(this);
}