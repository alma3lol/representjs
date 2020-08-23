import { Core, Decorators, Utils } from "../..";

describe('Utils', () => {
	describe('Datasources', () => {
		@Decorators.model({
			table: "table",
			uri: "uri"
		})
		class Test extends Core.Model<Test> {
			@Decorators.Model.ID({
				type: Number,
				default: 1
			})
			id: number;

			@Decorators.Model.property()
			test: string;
		}
		it('should generate a store schema from a model\'s instance', () => {
			const result = Utils.Datasources.generateDexieStore(new Test());
			expect(result).toEqual({ "table": "++id,test" });
		});
		it('should generate a store schema from a model\'s class', () => {
			const result = Utils.Datasources.generateDexieStore(Test);
			expect(result).toEqual({ "table": "++id,test" });
		});
	});
});