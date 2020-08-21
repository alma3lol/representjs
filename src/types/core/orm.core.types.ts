import { Class } from '../common.types';
import { Model, ORM as CoreORM } from "../../core";

export namespace ORM {
	/**
	 * ORM relation type
	 */
	export type RelationType = "HasMany" | "HasOne" | "BelongsTo";
	/**
	 * ORM relation base config
	 */
	export type RelationConfig<T extends Model<T>> = {
		/**
		 * Relation's name
		 */
		name?: string
		/**
		 * Model's class
		 */
		cls: Class<T>
	}
	/**
	 * ORM One Model relation config
	 */
	export type OneModelRelationConfig<T extends Model<T>> = RelationConfig<T> & {
		/**
		 * Foriegn keys
		 */
		keys: Record<keyof T, any>
	}
	/**
	 * ORM Many Models relation config
	 */
	export type ManyModelsRelationConfig<T extends Model<T>> = RelationConfig<T> & {
		/**
		 * A function to validate models
		 */
		iteratorFn: (model: T) => boolean
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