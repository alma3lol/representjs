import { Core, Types } from '..';
import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class API extends Core.Datasource {
	protected _client: AxiosInstance;
	constructor(config?: AxiosRequestConfig) {
		super(config);
		this._client = Axios.create(config);
	}
	get client() { return this._client; }
	async find<T extends Core.Model<T>>(cls: Types.Common.Class<T>, filter: Types.Thirdparty.Filter<T>): Promise<T[]> {
		const models: T[] = [];
		const data = await this._client.get<T[]>(`${cls.getURI()}/?filter=${JSON.stringify(filter)}`).then(res => res.data);
		data.forEach(row => {
			const model = new cls(row);
			this.mapper.bind<T>(model.ID_PROPERTY).to(model);
			models.push(model);
		});
		return models;
	}
	async findById<T extends Core.Model<T>>(cls: Types.Common.Class<T>, id: string | number): Promise<T> {
		const data = await this._client.get<T>(`${cls.getURI()}/${id}`).then(res => res.data);
		const model = new cls(data);
		this.mapper.bind<T>(model.ID_PROPERTY).to(model);
		return model;
	}
	async create<T extends Core.Model<T>>(cls: Types.Common.Class<T>, data: Partial<T>): Promise<T> {
		const model = new cls(data);
		const returnModel = await this._client.post<T>(`${cls.getURI()}/`, model.toJSON()).then(res => res.data);
		this.mapper.bind<T>(returnModel.ID_PROPERTY).to(returnModel);
		return returnModel;
	}
	async delete<T extends Core.Model<T>>(cls: Types.Common.Class<T>, idOrFilter: string | number | Types.Thirdparty.Where<T>): Promise<boolean> {
		const deleted = await this._client.delete(`${cls.getURI()}${(typeof idOrFilter === "string") ? `/${idOrFilter}` : `?where=${JSON.stringify(idOrFilter)}`}`).then(res => res.status === 200);
		if (deleted) {
			const keysToDeleted: string[] = [];
			if (typeof idOrFilter === "string") keysToDeleted.push(idOrFilter);
			else Object.keys(idOrFilter).forEach(key => keysToDeleted.push(key));
			keysToDeleted.forEach(key => this.mapper.unbind(key));
		}
		return deleted;
	}
	async update<T extends Core.Model<T>>(cls: Types.Common.Class<T>, data: Partial<T>, idOrFilter: string | number | Types.Thirdparty.Where<T>): Promise<number> {
		const model = new cls(data);
		const count = await this._client.put<{ count: number }>(`${cls.getURI()}${(typeof idOrFilter === "string") ? `/${idOrFilter}` : `?where=${JSON.stringify(idOrFilter)}`}`, model.toJSON()).then(res => res.data.count);
		if (count) {
			const keysToUpdate: string[] = [];
			if (typeof idOrFilter === "string") keysToUpdate.push(idOrFilter);
			else Object.keys(idOrFilter).forEach(key => keysToUpdate.push(key))
			keysToUpdate.forEach(key => {
				const mappedModel = this.mapper.get<T>(key) as any;
				Object.keys(model.toObject()).forEach(property => {
					if (model[property] !== undefined) mappedModel[property] = model[property];
				});
				this.mapper.bind<T>(key).to(mappedModel);
			});
		}
		return count;
	}
}