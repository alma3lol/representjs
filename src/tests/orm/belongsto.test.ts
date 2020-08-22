import { Booter, ORM, Core, Decorators } from '../..';

describe('ORM', () => {
	describe('BelongsTo', () => {
		it('should return a model from the relation', () => {
			class Test extends Core.Model<Test> {
				@Decorators.Model.property({
					id: true,
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