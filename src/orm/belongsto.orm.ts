import { Types } from '..';
import { ORM, Model } from '../core';

export class BelongsTo<T extends Model<T>> extends ORM.Relation implements Types.Core.ORM.OneModelRelation<T> {
	type: Types.Core.ORM.RelationType = "BelongsTo";
	constructor(
		protected readonly config: Types.Core.ORM.OneModelRelationConfig<T>
	) { super(config); }
	toModel = () => this.mapper.find(this.config.keys, this.config.cls);
}