import { Binding } from '../../core';

export namespace Datasource {
	export const NAME_KEY = new Binding.Key<string>("DATASOURCE.NAME");
	export const CONFIG_FILENAME_KEY = new Binding.Key<string>("DATASOURCE.CONFIG-FILENAME");
}