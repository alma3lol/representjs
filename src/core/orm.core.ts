import { CoreType, Bindings } from '../types';
import { Booter } from '..';
import { Model } from './model.core';

export namespace ORM {
	/**
	 * ORM relation's class
	 */
	export class Relation<T extends Model<T>> {
		protected mapper = Booter.getInstance().get(Bindings.Core.MODEL_MAPPER_KEY);
		constructor(
			protected readonly config: CoreType.ORM.RelationConfig<T>
		) { }
		/**
		 * Relation type
		 */
		type: CoreType.ORM.RelationType;
	}
}