import DexieModule, { DexieOptions } from 'dexie';
import { Types, Core } from '..';

export class Dexie extends Core.Datasource {
	protected _connection: DexieModule;
	constructor(config: Types.Datasources.Database.Config, options?: DexieOptions) {
		super(config)
		this._connection = new DexieModule(config.database, options);
		this._connection.version(config.version).stores(config.stores);
	}
	get connection() { return this._connection; }
	open = () => this._connection.open();
	async find<T extends Core.Model<T>>(table: string): Promise<T[]> {
		return this._connection.table<T>(table).toArray();
	}
	async findById<T extends Core.Model<T>>(table: string, key: string | number): Promise<T> {
		return await this._connection.table<T>(table).get(key).then(v => v) as T;
	}
	async create<T extends Core.Model<T>>(table: string, model: T): Promise<T> {
		return await this._connection.table<T>(table).add(model, model.ID).then(() => model);
	}
	async delete(table: string, key: string): Promise<boolean> {
		return await this._connection.table(table).delete(key).then(() => true, () => false);
	}
	async update<T extends Core.Model<T>>(table: string, model: T): Promise<number> {
		return await this._connection.table<T>(table).update(model.ID, model).then(v => v);
	}
}