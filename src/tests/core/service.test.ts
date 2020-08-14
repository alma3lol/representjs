import { Datasources, Core } from "../..";
jest.mock("axios");

describe('Core', () => {
	describe('Service', () => {
		it('should create an instance of service', () => {
			class TestDS extends Datasources.API { }
			class TestModel extends Core.Model<TestModel> { }
			const service = new Core.Service<TestModel>(new TestDS())
			expect(service).toBeInstanceOf(Core.Service);
		});
	});
});