import { Decorators, Core, Utils, Types, Booter, ORM } from "../..";

describe('Decorators', () => {
	describe('ORM', () => {
		class TestModel extends Core.Model<TestModel> {
			test: string;
		}
		beforeAll(() => {
			const mapper = Booter.getInstance().get(Types.Bindings.Core.MODEL_MAPPER_KEY);
			mapper.bind("123").to(new TestModel({ test: "123" }));
			mapper.bind("321").to(new TestModel({ test: "321" }));
		})
		it('should inject a relation into model\'s metadata', () => {
			class Test {
				@Decorators.ORM.relation("HasOne", {
					keys: {
						test: "123"
					},
					cls: TestModel
				})
				test: TestModel;
			}
			const result = Utils.Reflector.getMetadata(Types.Bindings.Model.RELATIONS_KEY.toString(), new Test())
			expect(result).toBeInstanceOf(Map);
			expect(result.get("test")).toBeInstanceOf(ORM.HasOne);
		});
		it('should inject a HasMany relation into model\'s metadata', () => {
			class Test {
				@Decorators.ORM.Relation.hasMany({
					cls: TestModel,
					iteratorFn: _ => true
				})
				test: TestModel;
			}
			const result = Utils.Reflector.getMetadata(Types.Bindings.Model.RELATIONS_KEY.toString(), new Test())
			expect(result).toBeInstanceOf(Map);
			expect(result.get("test")).toBeInstanceOf(ORM.HasMany);
			expect(result.get("test").toModels().length).toBe(2);
		});
	});
});