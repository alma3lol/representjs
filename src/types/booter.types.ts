import { Context, Core } from '..';
import { BindingKey } from '../core';

export namespace Bindings {
	export const CORE_CONTEXT_KEY = new BindingKey<Context.Core>("BOOTER.CORE-CONTEXT");
	export const DATASOURCE_CONTEXT_KEY = new BindingKey<Context.Datasource>("BOOTER.DATASOURCE-CONTEXT");
	export const MODEL_CONTEXT_KEY = new BindingKey<Context.Model>("BOOTER.MODEL-CONTEXT");
	export const REPOSITORY_CONTEXT_KEY = new BindingKey<Context.Repository>("BOOTER.REPOSITORY-CONTEXT");
	export const SERVICE_CONTEXT_KEY = new BindingKey<Context.Service>("BOOTER.SERVICE-CONTEXT");
}