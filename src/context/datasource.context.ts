import { Context, Datasource as CoreDatasource, Binding } from '../core';
import { Types } from '..';

export class Datasource extends Context {
	protected _registery: Map<string, Binding<Types.Common.Class<CoreDatasource>>> = new Map();
	static key() { return Types.Booter.Bindings.DATASOURCE_CONTEXT_KEY; }
}