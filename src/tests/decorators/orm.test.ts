import { Decorators, Core, Utils, Types, Booter, ORM } from "../..";
import { HasMany } from '../../orm';

describe('Decorators', () => {
	describe('ORM', () => {
		class TestModel extends Core.Model<TestModel> {
			@Decorators.Model.property()
			id: string;
		}
		beforeAll(() => {
			const mapper = Booter.getInstance().get(Types.Bindings.Core.MODEL_MAPPER_KEY);
			mapper.bind("123").to(new TestModel({ id: "123" }));
		})
		it('should inject a relation into model\'s metadata', () => {
			class Test extends Core.Model<Test> {
				@Decorators.Model.ID({
					type: String,
					default: "123"
				})
				id: string;

				@Decorators.ORM.relation("HasOne", {
					key: "id",
					cls: TestModel
				})
				test: TestModel;
			}
			const result = Utils.Reflector.getMetadata(Types.Bindings.Model.RELATIONS_KEY.toString(), new Test())
			expect(result).toBeInstanceOf(Map);
			expect(result.get("test")).toBeInstanceOf(ORM.HasOne);
		});
		it('should auto-resolve relation\'s value', () => {
			class Test extends Core.Model<Test> {
				@Decorators.Model.ID({
					type: String,
					default: "123"
				})
				id: string;

				@Decorators.ORM.Relation.hasOne({
					key: "id",
					cls: TestModel
				})
				test: TestModel;
			}
			const testClass = new Test();
			expect(testClass.test).toBeInstanceOf(TestModel);
			expect(testClass.test.id).toBe("123");
		});
		it('should be able to set relational properties\' value', () => {
			class Test extends Core.Model<Test> {
				@Decorators.Model.ID({
					type: String,
					default: "123"
				})
				id: string;

				@Decorators.ORM.Relation.belongsTo({
					key: "id",
					cls: TestModel
				})
				test: string;
			}
			const testClass = new Test({
				test: "123"
			});
			expect(testClass.test).toBeInstanceOf(TestModel);
			expect(JSON.parse(testClass.test.toString())).toEqual({ id: "123" });
		});
	});
});