import { Utils, Types, Decorators, Core } from "../..";

describe('Core', () => {
	describe('Datasource', () => {
		it('should return datasource\'s name', () => {
			class Test extends Core.Datasource {
				find<T extends Core.Model<T>>(uri: string, filter: any): Promise<T[]> {
					throw new Error("Method not implemented.");
				}
				findById<T extends Core.Model<T>>(uri: string, id: string | number): Promise<T | undefined> {
					throw new Error("Method not implemented.");
				}
				create<T extends Core.Model<T>>(uri: string, model: T): Promise<T> {
					throw new Error("Method not implemented.");
				}
				delete(uri: string, idOrFilter: any): Promise<boolean> {
					throw new Error("Method not implemented.");
				}
				update<T extends Core.Model<T>>(uri: string, model: T, filter?: any): Promise<number> {
					throw new Error("Method not implemented.");
				}
			}
			expect(Test.getName()).toBe("Test");
			expect(new Test({}).Name).toBe("Test");
		});
	});
});