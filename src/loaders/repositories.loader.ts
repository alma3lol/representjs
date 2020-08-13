import { Core, Injectors, Context, Types } from '..';

export class Repositories extends Core.Loader {
	@Injectors.context(Context.Repository)
	private ctx: Context.Repository
	@Injectors.Core.binding(Types.Context.Core.Bindings.PROJECT_ROOT_KEY)
	private _root: string;
	constructor(
		extension: string = ".repository.ts",
		dir: string = "repositories",
	) {
		super("Repositories Loader", extension, dir);
	}
	run() {
		super._run(this._root).then(() => {
			this.classes.forEach((repository, name) => {
				this.ctx.set(name, repository);
			});
		});
	}
}