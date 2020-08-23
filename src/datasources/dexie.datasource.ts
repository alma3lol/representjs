import DexieModule, { DexieOptions } from 'dexie';
import { Types, Core, Booter, Utils } from '..';

export class Dexie extends Core.Datasource {
	protected _connection: DexieModule;
	constructor(config: Types.Datasources.Dexie.Config, options?: DexieOptions) {
		super(config)
		this._connection = new DexieModule(config.database, options);
		const stores: {
			[tableName: string]: string
		} = {};
		const models = Booter.getInstance().get(Types.Bindings.Core.MODELS_KEY);
		models.forEach(model => {
			const schema = Utils.Datasources.generateDexieStore(model);
			Object.keys(schema).forEach(key => {
				stores[key] = schema[key];
			})
		})
		this._connection.version(config.version).stores(stores);
	}
	get connection() { return this._connection; }
	open = () => this._connection.open();
	async find<T extends Core.Model<T>>(table: string): Promise<T[]> {
		const models = await this._connection.table<T>(table).toArray();
		models.forEach(model => this.mapper.bind<T>(model.ID).to(model));
		return models;
	}
	async findById<T extends Core.Model<T>>(table: string, key: string | number): Promise<T | undefined> {
		const model = await this._connection.table<T>(table).get(key).then(v => v) as T | undefined;
		if (model !== undefined) this.mapper.bind<T>(model.ID).to(model);
		return model;
	}
	async create<T extends Core.Model<T>>(table: string, model: T): Promise<T> {
		await this._connection.table<T>(table).add(model, model.ID);
		this.mapper.bind<T>(model.ID).to(model);
		return model;
	}
	async delete(table: string, key: string): Promise<boolean> {
		const deleted = await this._connection.table(table).delete(key).then(() => true, () => false);
		if (deleted) this.mapper.unbind(key);
		return deleted;
	}
	async update<T extends Core.Model<T>>(table: string, model: T): Promise<number> {
		const count = await this._connection.table<T>(table).update(model.ID, model).then(v => v);
		if (count) {
			const mappedModel = this.mapper.get<T>(model.ID) as any;
			Object.keys(model).forEach(property => {
				if (model[property] !== undefined) mappedModel[property] = model[property];
			});
			this.mapper.bind<T>(model.ID).to(mappedModel);
		}
		return count;
	}
}