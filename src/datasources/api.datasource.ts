import { Core } from '..';
import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class API extends Core.Datasource {
	protected _client: AxiosInstance;
	constructor(config?: AxiosRequestConfig) {
		super(config);
		this._client = Axios.create(config);
	}
	get client() { return this._client; }
	async find<T extends Core.Model<T>>(uri: string, filter: any): Promise<T[]> {
		return await this._client.get(`${uri}/?filter=${JSON.stringify(filter)}`).then(res => res.data) as T[];
	}
	async findById<T extends Core.Model<T>>(uri: string, id: string | number): Promise<T> {
		return await this._client.get(`${uri}/${id}`).then(res => res.data) as T;
	}
	async create<T extends Core.Model<T>>(uri: string, model: T): Promise<T> {
		return await this._client.post(`${uri}/`, model.toJSON()).then(res => res.data) as T;
	}
	async delete(uri: string, idOrFilter: any): Promise<boolean> {
		return await this._client.delete(`${uri}${(typeof idOrFilter === "string") ? `/${idOrFilter}` : `?where=${JSON.stringify(idOrFilter)}`}`).then(res => res.status === 200);
	}
	async update<T extends Core.Model<T>>(uri: string, model: T, idOrFilter: any): Promise<number> {
		return await this._client.put(`${uri}${(typeof idOrFilter === "string") ? `/${idOrFilter}` : `?where=${JSON.stringify(idOrFilter)}`}`, model.toJSON()).then(res => res.data.count) as number;
	}
}