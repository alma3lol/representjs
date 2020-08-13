import { BindingKey } from '../../Core';

export namespace Model {
	/**
	 * Model's metadata binding keys
	 */
	export namespace Bindings {
		export const TABLE_KEY = new BindingKey<string>("MODEL.TABLE");
		export const NAME_KEY = new BindingKey<string>("MODEL.NAME");
		export const URI_KEY = new BindingKey<string>("MODEL.URI");
		export const ID_PROPERTY_KEY = new BindingKey<string>("MODEL.ID-PROPERTY");
	}
}