import { Core, Types } from '..';
import { ORM } from '../core';

export class HasMany<T extends Core.Model<T>> extends ORM.Relation<T> implements Types.Core.ORM.ManyModelsRelation<T> {
	type: Types.Core.ORM.RelationType = "HasMany";
	toModels = (target: T) => this.mapper.findMany(this.config.cls, this.config.key, target.ID)
}