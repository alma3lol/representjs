import { Decorators, Types, Core, Booter } from '../..';

describe('Decorators', () => {
	describe('Model', () => {
		it('should configure models', () => {
			@Decorators.Model.config({
				table: "table",
				uri: "uri"
			})
			class Test extends Core.Model<Test> { }
			expect(Core.Model.getSubKey(Test.name, Types.Bindings.Model.TABLE_KEY)?.value).toBe("table");
			expect(Core.Model.getSubKey(Test.name, Types.Bindings.Model.URI_KEY)?.value).toBe("uri");
			const models = Booter.getInstance().get(Types.Bindings.Core.MODELS_KEY);
			expect(models.length).toBe(1);
			expect(models[0]).toEqual(Test);
		});
		it('should decorate class\'s property', () => {
			@Decorators.Model.config({
				table: "table",
				uri: "uri"
			})
			class Test extends Core.Model<Test> {
				@Decorators.Model.ID({
					type: String,
					default: 'testing'
				})
				test: string;
			}
			const testClass = new Test();
			expect(Core.Model.getSubKey(testClass.Name, Types.Bindings.Model.ID_PROPERTY_KEY)?.value).toBeTruthy();
			expect(testClass.test).toBe("testing");
		});
	});
});