import { Utils, Types, Core } from '..';

export abstract class Datasource {
	constructor(private _config: any) { }
	get config() { return this._config; }
	static getName() {
		return Utils.Decorator.Reflector.getMetadata(Types.Context.Datasource.Bindings.NAME_KEY.toString(), this);
	}
	static getConfigFilename() {
		return Utils.Decorator.Reflector.getMetadata(Types.Context.Datasource.Bindings.CONFIG_FILENAME_KEY.toString(), this);
	}
	abstract find<T extends Core.Model<T>>(uri: string, filter: any): Promise<T[]>;
	abstract findById<T extends Core.Model<T>>(uri: string, id: string | number): Promise<T>;
	abstract create<T extends Core.Model<T>>(uri: string, model: T): Promise<T>;
	abstract delete(uri: string, idOrFilter: any): Promise<boolean>;
	abstract update<T extends Core.Model<T>>(uri: string, model: T, filter?: any): Promise<number>;
}