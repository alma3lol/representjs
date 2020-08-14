import { Context, Binding } from '../core';
import { Types } from '..';

export class Core extends Context {
	protected _registery: Map<string, Binding<Types.Context.Core.ContextType>> = new Map();
	static key() { return Types.Booter.Bindings.CORE_CONTEXT_KEY; }
}