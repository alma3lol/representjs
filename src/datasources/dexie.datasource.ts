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
	async find<T extends Core.Model<T>>(cls: Types.Common.Class<T>): Promise<T[]> {
		const models: T[] = []
		const data = await this._connection.table<T>(cls.getTable()).toArray();
		data.forEach(row => {
			const model = cls.serialize(cls, row);
			this.mapper.bind<T>(model.ID_PROPERTY).to(model);
			models.push(model);
		});
		return models;
	}
	async findById<T extends Core.Model<T>>(cls: Types.Common.Class<T>, key: string | number): Promise<T | undefined> {
		const data = await this._connection.table<T>(cls.getTable()).get(key).then(v => v) as T | undefined;
		if (data !== undefined) {
			const model = cls.serialize(cls, data);
			this.mapper.bind<T>(model.ID_PROPERTY).to(model);
			return model;
		}
		return undefined;
	}
	async create<T extends Core.Model<T>>(cls: Types.Common.Class<T>, data: Partial<T>): Promise<T> {
		const model = cls.serialize(cls, data);
		await this._connection.table<T>(cls.getTable()).add(model.toObject(), model.ID_PROPERTY).catch(_ => { });
		this.mapper.bind<T>(model.ID_PROPERTY).to(model);
		return model;
	}
	async delete<T extends Core.Model<T>>(cls: Types.Common.Class<T>, key: string): Promise<boolean> {
		const deleted = await this._connection.table(cls.getTable()).delete(key).then(() => true, () => false);
		if (deleted) this.mapper.unbind(key);
		return deleted;
	}
	async update<T extends Core.Model<T>>(cls: Types.Common.Class<T>, data: Partial<T>): Promise<number> {
		const model = cls.serialize(cls, data);
		const count = await this._connection.table<T>(cls.getTable()).update(model.ID_PROPERTY, model.toObject()).then(v => v, _ => 0);
		if (count) {
			const mappedModel = this.mapper.get<T>(model.ID_PROPERTY) as any;
			Object.keys(model.toObject()).forEach(property => {
				if (model[property] !== undefined) mappedModel[property] = model[property];
			});
			this.mapper.bind<T>(model.ID_PROPERTY).to(mappedModel);
		}
		return count;
	}
}