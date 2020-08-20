import { Types, Core } from '../..';

export namespace Context {
	export type ContextKeys =
		Types.Common.Class<Core.Context> |
		typeof Types.Booter.Bindings.CORE_CONTEXT_KEY |
		typeof Types.Booter.Bindings.DATASOURCE_CONTEXT_KEY |
		typeof Types.Booter.Bindings.MODEL_CONTEXT_KEY |
		typeof Types.Booter.Bindings.REPOSITORY_CONTEXT_KEY |
		typeof Types.Booter.Bindings.SERVICE_CONTEXT_KEY;
}