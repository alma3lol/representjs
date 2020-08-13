import { Core, Injectors, Context, Types } from '..';

export class Services extends Core.Loader {
	@Injectors.context(Context.Service)
	private ctx: Context.Service
	@Injectors.Core.binding(Types.Context.Core.Bindings.PROJECT_ROOT_KEY)
	private _root: string;
	constructor(
		extension: string = ".service.ts",
		dir: string = "services",
	) {
		super("Services Loader", extension, dir);
	}
	run() {
		super._run(this._root).then(() => {
			this.classes.forEach((service, name) => {
				this.ctx.set(name, service);
			});
		});
	}
}