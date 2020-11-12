import { Types, Utils, Core } from '..';
import { HasOne, HasMany, BelongsTo } from "../orm";
import { Model } from './model.decorator';

export namespace ORM {
	export const relation = <T extends Core.Model<T>>(type: Types.CoreType.ORM.RelationType, config: Types.CoreType.ORM.RelationConfig<T>): PropertyDecorator => {
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
		const getRelationsFromTarget = <T extends Core.Model<T>>(target: Object): Types.CoreType.ORM.MetadataType<T> => {
			let relations: Types.CoreType.ORM.MetadataType<T> = Utils.Reflector.getMetadata(Types.Bindings.Model.RELATIONS_KEY.toString(), target);
			if (relations === undefined) relations = new Map();
			return relations;
		}
		const setRelationsOnTarget = <T extends Core.Model<T>>(target: Object, relations: Types.CoreType.ORM.MetadataType<T>) => Utils.Reflector.defineMetadata(Types.Bindings.Model.RELATIONS_KEY.toString(), relations, target);
		const getPropertyDescriptorOrNewDescriptor = (o: any, p: string | number | symbol): PropertyDescriptor => {
			const descriptor = Object.getOwnPropertyDescriptor(o, p);
			let propertyValue: any;
			return (descriptor !== undefined) ? descriptor : {
				set: (v) => propertyValue = v,
				get: () => propertyValue
			}
		}
		export const hasOne = <T extends Core.Model<T>>(config: Types.CoreType.ORM.RelationConfig<T>): PropertyDecorator => {
			return (
				target,
				propertyKey
			): PropertyDescriptor => {
				Model.property()(target as T, propertyKey as string);
				const relation = new HasOne(config);
				const relations = getRelationsFromTarget(target);
				relations.set(propertyKey.toString(), relation);
				setRelationsOnTarget(target, relations);
				const descriptor = getPropertyDescriptorOrNewDescriptor(target, propertyKey);
				return {
					...descriptor,
					get: () => relation.resolveValue(target as T)
				}
			}
		}
		export const hasMany = <T extends Core.Model<T>>(config: Types.CoreType.ORM.RelationConfig<T>): PropertyDecorator => {
			return (
				target,
				propertyKey
			): PropertyDescriptor => {
				Model.property()(target as T, propertyKey as string);
				const relation = new HasMany(config);
				const relations = getRelationsFromTarget(target);
				relations.set(propertyKey.toString(), relation);
				setRelationsOnTarget(target, relations);
				const descriptor = getPropertyDescriptorOrNewDescriptor(target, propertyKey);
				return {
					...descriptor,
					get: () => relation.resolveValues(target as T)
				}
			}
		}
		export const belongsTo = <T extends Core.Model<T>>(config: Types.CoreType.ORM.RelationConfig<T>): PropertyDecorator => {
			return (
				target,
				propertyKey
			): PropertyDescriptor => {
				Model.property()(target as T, propertyKey as string);
				const relation = new BelongsTo(config);
				const relations = getRelationsFromTarget(target);
				relations.set(propertyKey.toString(), relation);
				setRelationsOnTarget(target, relations);
				return {
					set: (value) => relation.updateConfig({ ...config, value: value }),
					get: () => relation.resolveValue()
				}
			}
		}
	}
}