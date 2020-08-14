import { Injectors, Core, Datasources } from "../..";
jest.mock("axios");

describe('Injectors', () => {
	describe('Service', () => {
		it('should inject a service into a property', () => {
			class TestDS extends Datasources.API { }
			class TestModel extends Core.Model<TestModel> { }
			class Test {
				@Injectors.service(TestDS)
				service: Core.Service<TestModel>;
			}
			const testClass = new Test();
			expect(testClass.service).toBeInstanceOf(Core.Service);
		});
	});
});