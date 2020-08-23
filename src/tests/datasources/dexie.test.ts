import { Core, Decorators, Datasources } from "../..";
import 'fake-indexeddb/auto';

describe('Datasources', () => {
	describe('Dexie', () => {
		it('should create a datasource instance', () => {
			@Decorators.model({
				table: "testTable",
				uri: "/test"
			})
			class Test extends Core.Model<Test> {
				@Decorators.Model.ID({
					type: String,
					defaultFn: "uuidv4"
				})
				id: string;
			}
			const dexie = new Datasources.Dexie({
				database: "test",
				version: 1
			}, {
				autoOpen: true
			});
			expect(dexie.connection.tables.length).toBe(1);
		});
	});
});