import { Types, Utils, Core } from '..';
import { HasOne, HasMany, BelongsTo } from "../orm";

export namespace ORM {
	export const relation = <T extends Core.Model<T>>(type: Types.Core.ORM.RelationType, config: Types.Core.ORM.RelationConfig<T>): PropertyDecorator => {
		switch (type) {
			case "HasOne":
				return Relation.hasOne(config);
			case "HasMany":
				return Relation.hasMany(config);
			case "BelongsTo":
				return Relation.belongsTo(config);
			default:
				throw new Error(`No such a relation: '${type}'`);
		}
	}
	export namespace Relation {
		const getRelationsFromTarget = <T extends Core.Model<T>>(target: Object): Types.Core.ORM.MetadataType<T> => {
			let relations: Types.Core.ORM.MetadataType<T> = Utils.Reflector.getMetadata(Types.Bindings.Model.RELATIONS_KEY.toString(), target);
			if (relations === undefined) relations = new Map();
			return relations;
		}
		const setRelationsOnTarget = <T extends Core.Model<T>>(target: Object, relations: Types.Core.ORM.MetadataType<T>) => Utils.Reflector.defineMetadata(Types.Bindings.Model.RELATIONS_KEY.toString(), relations, target);
		export const hasOne = <T extends Core.Model<T>>(config: Types.Core.ORM.RelationConfig<T>): PropertyDecorator => {
			return (
				target,
				propertyKey
			): PropertyDescriptor => {
				const relation = new HasOne(config);
				const relations = getRelationsFromTarget(target);
				relations.set(propertyKey.toString(), relation);
				setRelationsOnTarget(target, relations);
				return {
					get: () => relation.toModel(target as T)
				}
			}
		}
		export const hasMany = <T extends Core.Model<T>>(config: Types.Core.ORM.RelationConfig<T>): PropertyDecorator => {
			return (
				target,
				propertyKey
			): PropertyDescriptor => {
				const relation = new HasMany(config);
				const relations = getRelationsFromTarget(target);
				relations.set(propertyKey.toString(), relation);
				setRelationsOnTarget(target, relations);
				return {
					get: () => relation.toModels(target as T)
				}
			}
		}
		export const belongsTo = <T extends Core.Model<T>>(config: Types.Core.ORM.RelationConfig<T>): PropertyDecorator => {
			return (
				target,
				propertyKey
			): PropertyDescriptor => {
				const relation = new BelongsTo(config);
				const relations = getRelationsFromTarget(target);
				relations.set(propertyKey.toString(), relation);
				setRelationsOnTarget(target, relations);
				return {
					get: () => relation.toModel(target as T)
				}
			}
		}
	}
}