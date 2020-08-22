import { Datasources, Core } from "../..";
jest.mock("axios");

describe('Core', () => {
	describe('Service', () => {
		it('should create an instance of service', () => {
			class TestDS extends Datasources.API { }
			const service = new Core.Service(new TestDS())
			expect(service).toBeInstanceOf(Core.Service);
		});
	});
});