import { Injectors, Core, Datasources } from "../..";
jest.mock("axios");

describe('Injectors', () => {
	describe('Service', () => {
		it('should inject a service into a property', () => {
			class TestDS extends Datasources.API { }
			class Test {
				@Injectors.service(TestDS)
				service: Core.Service;
			}
			const testClass = new Test();
			expect(testClass.service).toBeInstanceOf(Core.Service);
		});
	});
});