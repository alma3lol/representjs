import { Core, Injectors } from "../..";

describe('Injectors', () => {
	describe('Model', () => {
		it('should inject model into a property', () => {
			class TestModel extends Core.Model<TestModel> { }
			class Test {
				@Injectors.model(TestModel)
				model: TestModel;
			}
			expect(new Test().model).toBeInstanceOf(TestModel);
		});
	});
});