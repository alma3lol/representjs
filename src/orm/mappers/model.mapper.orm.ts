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
	find = <T extends CoreModel<T>>(keys: Record<keyof T, any>, cls: Common.Class<T>): T | undefined => {
		let returnModel: T | undefined = undefined;
		this._registery.forEach((model) => {
			if (model.value instanceof cls) {
				let thisModel = true;
				Object.keys(keys).forEach(key => {
					if (model.value[key] !== keys[key]) thisModel = false;
				});
				if (thisModel) returnModel = model.value;
			}
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
		this._registery.forEach((model) => {
			if (model.value instanceof cls && iteratorFn(model.value)) models.push(model.value);
		})
		return models;
	}
}