import { Core, Types } from '..';
import { ORM } from '../core';

export class HasMany<T extends Core.Model<T>> extends ORM.Relation implements Types.Core.ORM.ManyModelsRelation<T> {
	type: Types.Core.ORM.RelationType = "HasMany";
	constructor(
		protected readonly config: Types.Core.ORM.ManyModelsRelationConfig<T>
	) { super(config); }
	toModels = () => this.mapper.findMany(this.config.cls, this.config.iteratorFn)
}