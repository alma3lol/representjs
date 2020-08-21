import { Injectors, Core, Datasources } from "../..";
import indexeddb from 'fake-indexeddb';

describe('Injectors', () => {
	describe('Repository', () => {
		it('should inject a repository into a property', () => {
			class TestDS extends Datasources.Dexie { }
			class Test {
				@Injectors.repository(
					TestDS,
					{
						database: "",
						stores: "",
						version: 1
					},
					{
						indexedDB: indexeddb
					}
				)
				repository: Core.Repository;
			}
			const testClass = new Test();
			expect(testClass.repository).toBeInstanceOf(Core.Repository);
		});
	});
});