import { Utils } from '..';

export abstract class Loader {
	private _classes: Map<string, any> = new Map();
	private _files: string[];
	constructor(
		private _name: string,
		private _extension: string,
		private _dir: string
	) { }
	get name() { return this._name; }
	get classes() { return this._classes; }
	private dicover = async (root: string) => {
		const pattern = `${this._dir}/*${this._extension}`;
		this._files = await Utils.Loader.discoverFiles(pattern, root);
	}
	private load = () => {
		this._classes = Utils.Loader.loadClassesFromFiles(this._files);
	}
	protected _run = async (root: string) => {
		await this.dicover(root);
		this.load();
	}
	abstract run(): void;
}