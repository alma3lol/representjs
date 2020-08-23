import { Utils, Types, Core, Booter, ORM } from '..';

export abstract class Datasource {
	protected mapper = Booter.getInstance().get(ORM.Mappers.Model.key());
	constructor(private _config: any) { }
	get config() { return this._config; }
	static getName() {
		return Utils.Reflector.getMetadata(Types.Bindings.Datasource.NAME_KEY.toString(), this);
	}
	static getConfigFilename() {
		return Utils.Reflector.getMetadata(Types.Bindings.Datasource.CONFIG_FILENAME_KEY.toString(), this);
	}
	abstract find<T extends Core.Model<T>>(uri: string, filter: Types.Thirdparty.Filter<T>): Promise<T[]>;
	abstract findById<T extends Core.Model<T>>(uri: string, id: string | number): Promise<T | undefined>;
	abstract create<T extends Core.Model<T>>(uri: string, model: T): Promise<T>;
	abstract delete<T extends Core.Model<T>>(uri: string, idOrFilter: string | Types.Thirdparty.Where<T>): Promise<boolean>;
	abstract update<T extends Core.Model<T>>(uri: string, model: T, filter?: string | Types.Thirdparty.Where<T>): Promise<number>;
}