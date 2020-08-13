import { Datasources, Core } from '..';

export class Service {
	constructor(
		private _datasource: Datasources.API
	) { }
	get datasource() { return this._datasource; }
	find = (uri: string, filter: any) => this._datasource.find(uri, filter);
	findById = (uri: string, id: string | number) => this._datasource.findById(uri, id);
	create = <T extends Core.Model<T>>(uri: string, model: T) => this._datasource.create(uri, model);
	delete = (uri: string, idOrFilter: any) => this._datasource.delete(uri, idOrFilter);
	update = <T extends Core.Model<T>>(uri: string, model: T, idOrFilter: any) => this._datasource.update(uri, model, idOrFilter);
}