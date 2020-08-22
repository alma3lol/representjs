import { Types } from '..';
import { ORM, Model } from '../core';

export class BelongsTo<T extends Model<T>> extends ORM.Relation<T> implements Types.Core.ORM.OneModelRelation<T> {
	type: Types.Core.ORM.RelationType = "BelongsTo";
	toModel = (target: T) => this.mapper.find(this.config.cls, this.config.key, target.ID);
}