import { Core, Injectors, Context, Types } from '..';

export class Datasources extends Core.Loader {
	protected _classes: Map<string, typeof Core.Datasource> = new Map();
	get classes() { return this._classes; }
	@Injectors.context(Context.Datasource)
	private ctx: Context.Datasource;
	@Injectors.Core.binding(Types.Context.Core.Bindings.PROJECT_ROOT_KEY)
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
				this.ctx.bind(name).to(datasource);
			});
		});
	}
}