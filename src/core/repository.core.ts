import { Datasources, Core, Types } from '..';

export class Repository {
	constructor(
		private _datasource: Datasources.Dexie
	) { }
	get datasource() { return this._datasource; }
	find = <T extends Core.Model<T>>(cls: Types.Common.Class<T>) => this._datasource.find<T>(cls);
	findById = <T extends Core.Model<T>>(cls: Types.Common.Class<T>, key: string | number) => this._datasource.findById<T>(cls, key);
	create = <T extends Core.Model<T>>(cls: Types.Common.Class<T>, data: Partial<T>) => this._datasource.create(cls, data);
	delete = <T extends Core.Model<T>>(cls: Types.Common.Class<T>, key: string) => this._datasource.delete(cls, key);
	update = <T extends Core.Model<T>>(cls: Types.Common.Class<T>, data: Partial<T>) => this._datasource.update(cls, data);
}