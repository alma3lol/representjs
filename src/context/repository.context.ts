import { Context, Repository as CoreRepository, Binding } from '../core';
import { Booter, Common } from '../types';

export class Repository extends Context {
	protected _registery: Map<string, Binding<Common.Class<CoreRepository>>> = new Map();
	get name() { return Booter.Bindings.REPOSITORY_CONTEXT_KEY.toString(); }
}