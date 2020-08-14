import { Binding } from '../../Core';

export namespace Model {
	/**
	 * Model's metadata binding keys
	 */
	export namespace Bindings {
		export const TABLE_KEY = new Binding.Key<string>("MODEL.TABLE");
		export const NAME_KEY = new Binding.Key<string>("MODEL.NAME");
		export const URI_KEY = new Binding.Key<string>("MODEL.URI");
		export const ID_PROPERTY_KEY = new Binding.Key<string>("MODEL.ID-PROPERTY");
	}
}