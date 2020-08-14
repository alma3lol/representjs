import { Context, Model as CoreModel, Binding } from '../core';
import { Booter, Common } from '../types';

export class Model extends Context {
	protected _registery: Map<string, Binding.Value<Common.Class<typeof CoreModel>>> = new Map();
	static key() { return Booter.Bindings.MODEL_CONTEXT_KEY; }
}