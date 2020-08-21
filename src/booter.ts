import { Types } from '.';
import { Mappers } from "./orm";
import { Context, Loader, Binding } from './core';
import * as Loaders from './loaders';

/**
 * Booter class.
 * 
 * Instantiates loaders & mappers
 */
export class Booter extends Context {
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
	private _loaders: Loader[];
	/**
	 * Project's root
	 */
	project_root: string;
	/**
	 * Register mappers
	 */
	private register = () => {
		this.bind(Types.Bindings.Core.MODEL_MAPPER_KEY).to(new Mappers.Model());
	}
	/**
	 * Boot to set project's root & instantiate loaders
	 */
	boot = () => {
		const booted = this.has(Types.Bindings.Core.BOOTED_KEY);
		if (!booted) {
			this.bind(Types.Bindings.Core.PROJECT_ROOT_KEY).to(this.project_root);
			this._loaders = [
				new Loaders.Datasources(),
				new Loaders.Models(),
			]
			this.bind(Types.Bindings.Core.BOOTED_KEY).to(true);
		}
	}
	/**
	 * Run loaders to load datasources, models, ...etc
	 */
	load = async () => {
		const loaded = this.has(Types.Bindings.Core.LOADED_KEY);
		if (loaded) return;
		this.bind(Types.Bindings.Core.LOADED_KEY).to(true);
		this._loaders.forEach(loader => loader.run());
	}
	static key() { return new Binding.Key<string>("BOOTER"); };
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