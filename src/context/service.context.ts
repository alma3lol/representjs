import { Context, Service as CoreService, Binding } from '../core';
import { Booter, Common } from '../types';

export class Service extends Context {
	protected _registery: Map<string, Binding<Common.Class<CoreService>>> = new Map();
	get name() { return Booter.Bindings.SERVICE_CONTEXT_KEY.toString(); }
}