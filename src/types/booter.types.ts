import * as Context from '../context';
import { Binding } from '../core';

export namespace Bindings {
	export const CORE_CONTEXT_KEY = new Binding.Key<Context.Core>("BOOTER.CORE-CONTEXT");
	export const DATASOURCE_CONTEXT_KEY = new Binding.Key<Context.Datasource>("BOOTER.DATASOURCE-CONTEXT");
	export const MODEL_CONTEXT_KEY = new Binding.Key<Context.Model>("BOOTER.MODEL-CONTEXT");
	export const REPOSITORY_CONTEXT_KEY = new Binding.Key<Context.Repository>("BOOTER.REPOSITORY-CONTEXT");
	export const SERVICE_CONTEXT_KEY = new Binding.Key<Context.Service>("BOOTER.SERVICE-CONTEXT");
}