import { Booter, ORM, Core, Decorators } from '../..';

describe('ORM', () => {
	describe('HasMany', () => {
		it('should return models from the relation', () => {
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
			mapper.bind<Test>("123").toClass(Test);
			mapper.bind<Test>("321").toClass(Test);
			const relation = new ORM.HasMany({
				cls: Test,
				key: "id"
			})
			expect(relation.toModels(new Test()).length).toBe(2);
		});
	});
});