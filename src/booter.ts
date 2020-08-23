import { Types } from '.';
import { Mappers } from "./orm";
import { Context, Binding } from './core';

/**
 * Booter class.
 * 
 * Instantiates mappers
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
	 * Project's root
	 */
	project_root: string;
	/**
	 * Register mappers
	 */
	private register = () => {
		this.bind(Types.Bindings.Core.MODELS_KEY).to([]);
		this.bind(Types.Bindings.Core.MODEL_MAPPER_KEY).to(new Mappers.Model());
	}
	/**
	 * Boot to set project's root & instantiate loaders
	 */
	boot = () => {
		const booted = this.has(Types.Bindings.Core.BOOTED_KEY);
		if (!booted) {
			this.bind(Types.Bindings.Core.PROJECT_ROOT_KEY).to(this.project_root);
			this.bind(Types.Bindings.Core.BOOTED_KEY).to(true);
		}
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