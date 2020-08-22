import { Context, Binding, Model as CoreModel } from '../../core';
import { Common, Bindings } from '../../types';

export class Model extends Context {
	protected _registery: Map<string, Binding.Value<any>> = new Map();
	static key() { return Bindings.Core.MODEL_MAPPER_KEY; }
	/**
	 * Find a model using key, value & class
	 * 
	 * @param cls Model's class
	 * @param key Model's key
	 * @param value Model's value
	 */
	find = <T extends CoreModel<T>>(cls: Common.Class<T>, key: string, value: any): T | undefined => {
		let returnModel: T | undefined = undefined;
		this._registery.forEach((model) => {
			if (model.value instanceof cls && model.value[key] === value) returnModel = model.value;
		})
		return returnModel;
	}
	/**
	 * Find many models using key, value & class
	 * 
	 * @param cls Model's class
	 * @param key Model's key
	 * @param value Model's value
	 */
	findMany = <T extends CoreModel<T>>(cls: Common.Class<T>, key: string, value: any): T[] => {
		const models: T[] = [];
		this._registery.forEach((model) => {
			if (model.value instanceof cls && model.value[key] === value) models.push(model.value);
		})
		return models;
	}
}