import { Binding } from '../../core';

export namespace Datasource {
	/**
	 * Datasource's metadata binding keys
	 */
	export namespace Bindings {
		export const NAME_KEY = new Binding.Key<string>("DATASOURCE.NAME");
		export const CONFIG_FILENAME_KEY = new Binding.Key<string>("DATASOURCE.CONFIG-FILENAME");
	}
}