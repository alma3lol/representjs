import { Core, Types } from '..';
import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class API extends Core.Datasource {
	protected _client: AxiosInstance;
	constructor(config?: AxiosRequestConfig) {
		super(config);
		this._client = Axios.create(config);
	}
	get client() { return this._client; }
	async find<T extends Core.Model<T>>(uri: string, filter: Types.Thirdparty.Filter<T>): Promise<T[]> {
		const models = await this._client.get(`${uri}/?filter=${JSON.stringify(filter)}`).then(res => res.data) as T[];
		models.forEach(model => this.mapper.bind<T>(model.ID_PROPERTY).to(model));
		return models;
	}
	async findById<T extends Core.Model<T>>(uri: string, id: string | number): Promise<T | undefined> {
		const model = await this._client.get(`${uri}/${id}`).then(res => res.data) as T | undefined;
		if (model !== undefined) this.mapper.bind<T>(model.ID_PROPERTY).to(model);
		return model;
	}
	async create<T extends Core.Model<T>>(uri: string, model: T): Promise<T> {
		const returnModel = await this._client.post(`${uri}/`, model.toJSON()).then(res => res.data) as T;
		this.mapper.bind<T>(returnModel.ID_PROPERTY).to(returnModel);
		return returnModel;
	}
	async delete<T extends Core.Model<T>>(uri: string, idOrFilter: string | Types.Thirdparty.Where<T>): Promise<boolean> {
		const deleted = await this._client.delete(`${uri}${(typeof idOrFilter === "string") ? `/${idOrFilter}` : `?where=${JSON.stringify(idOrFilter)}`}`).then(res => res.status === 200);
		if (deleted) {
			const keysToDeleted: string[] = [];
			if (typeof idOrFilter === "string") keysToDeleted.push(idOrFilter);
			else Object.keys(idOrFilter).forEach(key => keysToDeleted.push(key));
			keysToDeleted.forEach(key => this.mapper.unbind(key));
		}
		return deleted;
	}
	async update<T extends Core.Model<T>>(uri: string, model: T, idOrFilter: string | Types.Thirdparty.Where<T>): Promise<number> {
		const count = await this._client.put(`${uri}${(typeof idOrFilter === "string") ? `/${idOrFilter}` : `?where=${JSON.stringify(idOrFilter)}`}`, model.toJSON()).then(res => res.data.count) as number;
		if (count) {
			const keysToUpdate: string[] = [];
			if (typeof idOrFilter === "string") keysToUpdate.push(idOrFilter);
			else Object.keys(idOrFilter).forEach(key => keysToUpdate.push(key))
			keysToUpdate.forEach(key => {
				const mappedModel = this.mapper.get<T>(key) as any;
				Object.keys(model).forEach(property => {
					if (model[property] !== undefined) mappedModel[property] = model[property];
				});
				this.mapper.bind<T>(key).to(mappedModel);
			});
		}
		return count;
	}
}