import { Datasources, Core, Types } from '..';

export class Service {
	constructor(
		private _datasource: Datasources.API
	) { }
	get datasource() { return this._datasource; }
	find = <T extends Core.Model<T>>(cls: Types.Common.Class<T>, filter: Types.Thirdparty.Filter<T>) => this._datasource.find<T>(cls, filter);
	findById = <T extends Core.Model<T>>(cls: Types.Common.Class<T>, id: string | number) => this._datasource.findById<T>(cls, id);
	create = <T extends Core.Model<T>>(cls: Types.Common.Class<T>, model: T) => this._datasource.create(cls, model);
	delete = <T extends Core.Model<T>>(cls: Types.Common.Class<T>, idOrFilter: string | number | Types.Thirdparty.Where<T>) => this._datasource.delete(cls, idOrFilter);
	update = <T extends Core.Model<T>>(cls: Types.Common.Class<T>, data: T, idOrFilter: string | number | Types.Thirdparty.Where<T>) => this._datasource.update(cls, data, idOrFilter);
}