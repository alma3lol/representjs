import { Datasources, Core } from '..';

export class Service {
	constructor(
		private _datasource: Datasources.API
	) { }
	get datasource() { return this._datasource; }
	find = <T extends Core.Model<T>>(uri: string, filter: any) => this._datasource.find<T>(uri, filter);
	findById = <T extends Core.Model<T>>(uri: string, id: string | number) => this._datasource.findById<T>(uri, id);
	create = <T extends Core.Model<T>>(uri: string, model: T) => this._datasource.create(uri, model);
	delete = <T extends Core.Model<T>>(uri: string, idOrFilter: any) => this._datasource.delete(uri, idOrFilter);
	update = <T extends Core.Model<T>>(uri: string, model: T, idOrFilter: any) => this._datasource.update(uri, model, idOrFilter);
}