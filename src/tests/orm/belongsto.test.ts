import { Booter, ORM, Core, Decorators } from '../..';

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
			const mapper = Booter.getInstance().get(ORM.Mappers.Model.key())
			const testClass = new Test();
			mapper.bind<Test>("123").to(testClass);
			const relation = new ORM.BelongsTo<Test>({
				cls: Test,
				key: "test"
			})
			expect(relation.toModel(testClass)).toBeInstanceOf(Test);
			expect(relation.toModel(testClass)?.test).toBe("123");
		});
	});
});