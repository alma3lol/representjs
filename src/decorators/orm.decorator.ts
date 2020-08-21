import { Types, Utils, Core } from '..';
import { HasOne, HasMany, BelongsTo } from "../orm";

export namespace ORM {
	export const relation = <T extends Core.Model<T>>(type: Types.Core.ORM.RelationType, config: Types.Core.ORM.ManyModelsRelationConfig<T> | Types.Core.ORM.OneModelRelationConfig<T>): PropertyDecorator => {
		switch (type) {
			case "HasOne":
				return Relation.hasOne(config as Types.Core.ORM.OneModelRelationConfig<T>);
			case "HasMany":
				return Relation.hasMany(config as Types.Core.ORM.ManyModelsRelationConfig<T>);
			case "BelongsTo":
				return Relation.belongsTo(config as Types.Core.ORM.OneModelRelationConfig<T>);
			default:
				throw new Error(`No such a relation: '${type}'`);
		}
	}
	export namespace Relation {
		const getRelationsFromTarget = (target: Object): Types.Core.ORM.MetadataType => {
			let relations: Types.Core.ORM.MetadataType = Utils.Reflector.getMetadata(Types.Bindings.Model.RELATIONS_KEY.toString(), target);
			if (relations === undefined) relations = new Map();
			return relations;
		}
		const setRelationsOnTarget = (target: Object, relations: Types.Core.ORM.MetadataType) => Utils.Reflector.defineMetadata(Types.Bindings.Model.RELATIONS_KEY.toString(), relations, target);
		export const hasOne = <T extends Core.Model<T>>(config: Types.Core.ORM.OneModelRelationConfig<T>): PropertyDecorator => {
			return (
				target,
				propertyKey
			) => {
				const relations = getRelationsFromTarget(target);
				relations.set(propertyKey.toString(), new HasOne(config));
				setRelationsOnTarget(target, relations);
			}
		}
		export const hasMany = <T extends Core.Model<T>>(config: Types.Core.ORM.ManyModelsRelationConfig<T>): PropertyDecorator => {
			return (
				target,
				propertyKey
			) => {
				const relations = getRelationsFromTarget(target);
				relations.set(propertyKey.toString(), new HasMany(config));
				setRelationsOnTarget(target, relations);
			}
		}
		export const belongsTo = <T extends Core.Model<T>>(config: Types.Core.ORM.OneModelRelationConfig<T>): PropertyDecorator => {
			return (
				target,
				propertyKey
			) => {
				const relations = getRelationsFromTarget(target);
				relations.set(propertyKey.toString(), new BelongsTo(config));
				setRelationsOnTarget(target, relations);
			}
		}
	}
}