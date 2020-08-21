import { Core, Injectors } from "../..";

describe('Injectors', () => {
	describe('Datasource', () => {
		it('should inject datasource into a property', () => {
			class TestDS extends Core.Datasource {
				find<T extends Core.Model<T>>(uri: string, filter: any): Promise<T[]> {
					throw new Error("Method not implemented.");
				}
				findById<T extends Core.Model<T>>(uri: string, id: string | number): Promise<T> {
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
			class Test {
				@Injectors.datasource(TestDS)
				ds: TestDS;
			}
			expect(new Test().ds).toBeInstanceOf(TestDS);
		});
	});
});