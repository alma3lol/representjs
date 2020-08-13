import { BindingKey } from '../../core';

export namespace Datasource {
	/**
	 * Datasource's metadata binding keys
	 */
	export namespace Bindings {
		export const NAME_KEY = new BindingKey<string>("DATASOURCE.NAME");
		export const CONFIG_FILENAME_KEY = new BindingKey<string>("DATASOURCE.CONFIG-FILENAME");
	}
}