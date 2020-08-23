import { Binding } from '../../core';
import { Model } from '../../orm/mappers';
import { Common } from '..';

export namespace Core {
	export const PROJECT_ROOT_KEY = new Binding.Key<string>("CORE.PROJECT-ROOT");
	export const BOOTED_KEY = new Binding.Key<boolean>("CORE.BOOTED");
	export const LOADED_KEY = new Binding.Key<boolean>("CORE.LOADED");
	export const MODEL_MAPPER_KEY = new Binding.Key<Model>("CORE.ORM.MODEL-MAPPER");
	export const MODELS_KEY = new Binding.Key<Common.Class<any>[]>("CORE.MODELS");
}