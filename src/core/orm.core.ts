import { Core, Bindings } from '../types';
import { Booter } from '..';

export namespace ORM {
	/**
	 * ORM relation's class
	 */
	export class Relation {
		protected mapper = Booter.getInstance().get(Bindings.Core.MODEL_MAPPER_KEY);
		constructor(
			protected readonly config: Core.ORM.RelationConfig<any>
		) { }
		/**
		 * Relation type
		 */
		type: Core.ORM.RelationType;
	}
}