import { Binding, ORM } from '../../core';

export namespace Model {
	export const TABLE_KEY = new Binding.Key<string>("MODEL.TABLE");
	export const NAME_KEY = new Binding.Key<string>("MODEL.NAME");
	export const URI_KEY = new Binding.Key<string>("MODEL.URI");
	export const ID_PROPERTY_KEY = new Binding.Key<string>("MODEL.ID-PROPERTY");
	export const RELATIONS_KEY = new Binding.Key<ORM.Relation<any>[]>("MODEL.RELATION");
}