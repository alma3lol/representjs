import { Class } from '../types/common.types';

export namespace Core {
	export const serialize = <T>(cls: Class<T>, data?: Partial<T>): T => {
		const obj = new cls();
		Object.assign(obj, data);
		return obj;
	}
}