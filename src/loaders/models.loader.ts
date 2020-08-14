import { Core, Injectors, Context, Types } from '..';

export class Models extends Core.Loader {
	protected _classes: Map<string, typeof Core.Model> = new Map();
	get classes() { return this._classes; }
	@Injectors.context(Context.Model)
	private ctx: Context.Model
	@Injectors.Core.binding(Types.Context.Core.Bindings.PROJECT_ROOT_KEY)
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
				this.ctx.bind(name).to(model);
			});
		});
	}
}