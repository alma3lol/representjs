import { Datasources, Core } from '..';

export class Repository {
	constructor(
		private _datasource: Datasources.Dexie
	) { }
	get datasource() { return this._datasource; }
	find = <T extends Core.Model<T>>(table: string) => this._datasource.find<T>(table);
	findById = <T extends Core.Model<T>>(table: string, key: string | number) => this._datasource.findById<T>(table, key);
	create = <T extends Core.Model<T>>(table: string, model: T) => this._datasource.create(table, model);
	delete = <T extends Core.Model<T>>(table: string, key: string) => this._datasource.delete(table, key);
	update = <T extends Core.Model<T>>(table: string, model: T) => this._datasource.update(table, model);
}