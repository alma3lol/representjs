import { Context, Service as CoreService, Binding } from '../core';
import { Booter } from '../types';

export class Service extends Context {
	protected _registery: Map<string, Binding<typeof CoreService>> = new Map();
	static key() { return Booter.Bindings.SERVICE_CONTEXT_KEY; }
}