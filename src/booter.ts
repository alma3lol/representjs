import { Types, Core, Context, Loaders } from '.';
import { Context as CoreContext } from "./core";
import { Mappers } from "./orm";

/**
 * Booter class.
 * 
 * Instantiates contexts, loaders & mappers
 */
export class Booter extends CoreContext {
	/**
	 * This makes the class uninstatiatable (No 'new Booter()')
	 */
	private constructor() { super(); }
	/**
	 * Instance property for the Singleton pattern
	 */
	private static _instance: Booter;
	/**
	 * Array of loaders to run when calling [load()](#load)
	 */
	private _loaders: Core.Loader[];
	/**
	 * Project's root
	 */
	project_root: string;
	/**
	 * Register contexts, loaders & mappers
	 */
	private register = () => {
		const coreCtx = new Context.Core();
		coreCtx.bind(Types.Context.Core.Bindings.MODEL_MAPPER_KEY).to(new Mappers.Model());
		this.bind(Types.Booter.Bindings.CORE_CONTEXT_KEY).to(coreCtx);
		this.bind(Types.Booter.Bindings.CORE_CONTEXT_KEY).to(new Context.Core());
		this.bind(Types.Booter.Bindings.DATASOURCE_CONTEXT_KEY).to(new Context.Datasource());
		this.bind(Types.Booter.Bindings.MODEL_CONTEXT_KEY).to(new Context.Model());
		this.bind(Types.Booter.Bindings.REPOSITORY_CONTEXT_KEY).to(new Context.Repository());
		this.bind(Types.Booter.Bindings.SERVICE_CONTEXT_KEY).to(new Context.Service());
	}
	/**
	 * Boot to set project's root & instantiate loaders
	 */
	boot = () => {
		const ctx = this.get(Types.Booter.Bindings.CORE_CONTEXT_KEY);
		const booted = ctx.has(Types.Context.Core.Bindings.BOOTED_KEY);
		if (!booted) {
			ctx.bind(Types.Context.Core.Bindings.PROJECT_ROOT_KEY).to(this.project_root);
			this._loaders = [
				new Loaders.Datasources(),
				new Loaders.Models(),
			]
			ctx.bind(Types.Context.Core.Bindings.BOOTED_KEY).to(true);
		}
	}
	/**
	 * Run loaders to load datasources, models, ...etc
	 */
	load = async () => {
		const ctx = this.get(Types.Booter.Bindings.CORE_CONTEXT_KEY);
		const loaded = ctx.has(Types.Context.Core.Bindings.LOADED_KEY);
		if (loaded) return;
		ctx.bind(Types.Context.Core.Bindings.LOADED_KEY).to(true);
		this._loaders.forEach(loader => loader.run());
	}
	static key() { return new Core.Binding.Key<string>("BOOTER"); };
	/**
	 * Create or return an instance of the booter. (Singleton pattern)
	 */
	static getInstance(): Booter {
		if (this._instance === undefined) {
			this._instance = new this();
			this._instance.register();
		}
		return this._instance;
	}
}