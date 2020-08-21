import { Class } from '../common.types';
import { Model, ORM as CoreORM } from "../../core";

export namespace ORM {
	/**
	 * ORM relation type
	 */
	export type RelationType = "HasMany" | "HasOne" | "BelongsTo";
	/**
	 * ORM relation config
	 */
	export type RelationConfig<T extends Model<T>> = {
		/**
		 * Relation's name
		 */
		name?: string
		/**
		 * Foriegn key
		 */
		key: string
		/**
		 * Model's class
		 */
		cls: Class<T>
	}
	/**
	 * Relations metadata type
	 */
	export type MetadataType = Map<string, CoreORM.Relation>
	/**
	 * One object model relation interface
	 */
	export interface OneModelRelation<T extends Model<T>> {
		toModel: () => T | undefined;
	}
	/**
	 * Many object models relation interface
	 */
	export interface ManyModelsRelation<T extends Model<T>> {
		toModels: () => T[];
	}
}