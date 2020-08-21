import { Context, Binding, Model as CoreModel } from '../../core';
import { Common, Bindings } from '../../types';

export class Model extends Context {
	protected _registery: Map<string, Binding.Value<any>> = new Map();
	static key() { return Bindings.Core.MODEL_MAPPER_KEY; }
	/**
	 * Find a model by key & class
	 * 
	 * @param key Model's key
	 * @param cls Model's class
	 */
	find = <T extends CoreModel<T>>(key: string, value: any, cls: Common.Class<T>): T | undefined => {
		let returnModel: T | undefined = undefined;
		this._registery.forEach((model) => {
			if (model.value instanceof cls && model.value[key] === value) returnModel = model.value;
		})
		return returnModel;
	}
	/**
	 * Find many models in the registery based on an iterator function's result
	 * 
	 * @param cls Models' class
	 * @param iteratorFn A function to validate models
	 */
	findMany = <T extends CoreModel<T>>(cls: Common.Class<T>, iteratorFn: (model: T) => boolean): T[] => {
		const models: T[] = [];
		this._registery.forEach((value) => {
			if (value.value instanceof cls && iteratorFn(value.value)) models.push(value.value);
		})
		return models;
	}
}