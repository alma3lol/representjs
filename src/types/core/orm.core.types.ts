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
		/**
		 * Relation's key
		 */
		key: string
	}
	/**
	 * Relations metadata type
	 */
	export type MetadataType<T extends Model<T>> = Map<string, CoreORM.Relation<T>>
	/**
	 * One object model relation interface
	 */
	export interface OneModelRelation<T extends Model<T>> {
		toModel: (target: T) => T | undefined;
	}
	/**
	 * Many object models relation interface
	 */
	export interface ManyModelsRelation<T extends Model<T>> {
		toModels: (target: T) => T[];
	}
}