import { Types } from '..';

export class Injector {
	private constructor() { }
	static createClassInjector<T>(cls: Types.Common.Class<T>): PropertyDecorator {
		return (): PropertyDescriptor => {
			return {
				get: () => new cls()
			}
		}
	}
}