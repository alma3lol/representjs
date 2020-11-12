import { Booter, ORM, Core, Decorators, Types } from '../..';

describe('ORM', () => {
	describe('BelongsTo', () => {
		it('should return a model from the relation', () => {
			@Decorators.model({
				table: "table",
				uri: "uri"
			})
			class Test extends Core.Model<Test> {
				@Decorators.Model.ID({
					type: String,
					default: "123"
				})
				test: string;
			}
			const mapper = Booter.getInstance().get(Types.Bindings.Core.MODEL_MAPPER_KEY)
			const testClass = new Test();
			mapper.bind<Test>("123").to(testClass);
			const relation = new ORM.BelongsTo<Test>({
				cls: Test,
				key: "test",
				value: "123"
			})
			expect(relation.resolveValue()).toBeInstanceOf(Test);
			expect(relation.resolveValue()?.test).toBe("123");
		});
	});
});