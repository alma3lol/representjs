import { BindingKey } from "../../core";

export namespace Core {
	export type ContextType = string | boolean;
	export namespace Bindings {
		export const PROJECT_ROOT_KEY = new BindingKey<string>("CORE.PROJECT-ROOT");
		export const BOOTED_KEY = new BindingKey<boolean>("CORE.BOOTED");
		export const LOADED_KEY = new BindingKey<boolean>("CORE.LOADED");
	}
}