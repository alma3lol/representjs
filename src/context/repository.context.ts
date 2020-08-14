import { Context, Repository as CoreRepository, Binding } from '../core';
import { Booter, Common } from '../types';

export class Repository extends Context {
	protected _registery: Map<string, Binding.Value<Common.Class<CoreRepository>>> = new Map();
	static key() { return Booter.Bindings.REPOSITORY_CONTEXT_KEY; }
}