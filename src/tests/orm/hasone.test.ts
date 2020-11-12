import { Booter, ORM, Core, Decorators } from '../..';

describe('ORM', () => {
	describe('HasOne', () => {
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
				id: string;
			}
			const mapper = Booter.getInstance().get(ORM.Mappers.Model.key())
			const testClass = new Test();
			mapper.bind<Test>("123").to(testClass);
			const relation = new ORM.HasOne({
				cls: Test,
				key: "id"
			})
			expect(relation.resolveValue(testClass)).toBeInstanceOf(Test);
			expect(relation.resolveValue(testClass)?.id).toBe("123");
		});
	});
});