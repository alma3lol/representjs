import { Types, Booter } from '..';
import * as Injectors from "../injectors";
import { Loader, Model } from '../core';

export class Models extends Loader {
	protected _classes: Map<string, typeof Model> = new Map();
	get classes() { return this._classes; }
	@Injectors.Core.booter()
	private booter: Booter;
	@Injectors.Core.binding(Types.Bindings.Core.PROJECT_ROOT_KEY)
	private _root: string;
	constructor(
		extension: string = ".model.ts",
		dir: string = "models",
	) {
		super("Models Loader", extension, dir);
	}
	run() {
		super._run(this._root).then(() => {
			this.classes.forEach((model, name) => {
				this.booter.bind(name).to(model);
			});
		});
	}
}