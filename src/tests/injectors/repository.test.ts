import { Injectors, Core, Datasources } from "../..";
import "fake-indexeddb/auto";

describe('Injectors', () => {
	describe('Repository', () => {
		it('should inject a repository into a property', () => {
			class TestDS extends Datasources.Dexie { }
			class Test {
				@Injectors.repository(
					TestDS,
					{
						database: "test",
						version: 1
					}
				)
				repository: Core.Repository;
			}
			const testClass = new Test();
			expect(testClass.repository).toBeInstanceOf(Core.Repository);
		});
	});
});