import { Datasources, Core } from '..';

export class Repository {
	constructor(
		private _datasource: Datasources.Dexie
	) { }
	get datasource() { return this._datasource; }
	find = (table: string) => this._datasource.find(table);
	findById = (table: string, key: string | number) => this._datasource.findById(table, key);
	create = <T extends Core.Model<T>>(table: string, model: T) => this._datasource.create(table, model);
	delete = (table: string, key: string) => this._datasource.delete(table, key);
	update = <T extends Core.Model<T>>(table: string, model: T) => this._datasource.update(table, model);
}