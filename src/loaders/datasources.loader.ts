import { Types, Booter } from '..';
import { Core } from '../injectors';
import { Loader, Datasource } from '../core';
import { API, Dexie } from '../datasources';

export class Datasources extends Loader {
	protected _classes: Map<string, Datasource | API | Dexie> = new Map();
	get classes() { return this._classes; }
	@Core.booter()
	private booter: Booter;
	@Core.binding(Types.Bindings.Core.PROJECT_ROOT_KEY)
	private _root: string;
	constructor(
		extension: string = ".datasource.ts",
		dir: string = "datasources",
	) {
		super("Datasources Loader", extension, dir);
	}
	run() {
		super._run(this._root).then(() => {
			this.classes.forEach((datasource, name) => {
				this.booter.bind(name).to(datasource);
			});
		});
	}
}