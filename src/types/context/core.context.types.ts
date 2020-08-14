import { Binding, Context } from "../../core";
import { ORM } from '../..';

export namespace Core {
	export type ContextType = string | boolean | typeof Context;
	export namespace Bindings {
		export const PROJECT_ROOT_KEY = new Binding.Key<string>("CORE.PROJECT-ROOT");
		export const BOOTED_KEY = new Binding.Key<boolean>("CORE.BOOTED");
		export const LOADED_KEY = new Binding.Key<boolean>("CORE.LOADED");
		export const MODEL_MAPPER_KEY = new Binding.Key<ORM.Mappers.Model>("CORE.ORM.MODEL-MAPPER");
	}
}