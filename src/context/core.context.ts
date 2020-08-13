import { Context, Binding } from '../core';
import { Types } from '..';

export class Core extends Context {
	protected _registery: Map<string, Binding<Types.Context.Core.ContextType>> = new Map();
	get name() { return Types.Booter.Bindings.CORE_CONTEXT_KEY.toString(); }
}