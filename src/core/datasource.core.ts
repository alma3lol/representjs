import { Types, Core, Booter, ORM } from '..';

export abstract class Datasource {
	protected mapper = Booter.getInstance().get(ORM.Mappers.Model.key());
	constructor(private _config: any) { }
	get config() { return this._config; }
	get Name() {
		return this.constructor.name;
	}
	static getName() {
		return this.name;
	}
	abstract find<T extends Core.Model<T>>(cls: Types.Common.Class<T>, filter: Types.Thirdparty.Filter<T>): Promise<T[]>;
	abstract findById<T extends Core.Model<T>>(cls: Types.Common.Class<T>, id: string | number): Promise<T | undefined>;
	abstract create<T extends Core.Model<T>>(cls: Types.Common.Class<T>, data: Partial<T>): Promise<T>;
	abstract delete<T extends Core.Model<T>>(cls: Types.Common.Class<T>, idOrFilter: string | number | Types.Thirdparty.Where<T>): Promise<boolean>;
	abstract update<T extends Core.Model<T>>(cls: Types.Common.Class<T>, data: Partial<T>, idOrFilter: string | number | Types.Thirdparty.Where<T>): Promise<number>;
}