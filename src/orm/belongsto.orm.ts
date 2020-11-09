import { Types } from '..';
import { ORM, Model } from '../core';

export class BelongsTo<T extends Model<T>> extends ORM.Relation<T> implements Types.CoreType.ORM.OneModelRelation<T> {
	type: Types.CoreType.ORM.RelationType = "BelongsTo";
	toModel = (target: T) => this.mapper.find(this.config.cls, this.config.key, target.ID_PROPERTY);
}