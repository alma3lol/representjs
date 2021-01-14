import {ModelTemplate} from '../templates';
import {Templates} from '../types';
import {writeFileSync} from 'fs';
import {commander} from './commander';
import {Models} from './models';

export class Reference {
	constructor(
		public readonly model: ModelTemplate,
		public readonly relation: Templates.Models.Relation
	) { }
	update = (newRelation: Templates.Models.Relation) => {
		this.model.relations.update(this.relation.name, newRelation);
		this._updateModel();
	}
	delete = () => {
		this.model.relations.remove(this.relation.name);
		this._updateModel();
	}
	private _updateModel = () => {
		writeFileSync(`${commander.opts()['srcDir']}/${Models.generateFileName(this.model.name)}.ts`, this.model.generate());
	}
}
