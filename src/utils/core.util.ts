import { Class } from '../types/common.types'

export namespace Core {
	export const serialize = <T>(data: Partial<T>, cls: Class<T>): T => new cls(data);
}