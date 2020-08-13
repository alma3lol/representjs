import { Utils, Types, Decorators, Core } from "../..";

describe('Core', () => {
	describe('Datasource', () => {
		it('should return datasource\'s name & configuration filename', () => {
			@Decorators.datasource({
				name: "testing",
				configFilename: "testing"
			})
			class Test extends Core.Datasource {
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
			expect(Utils.Decorator.Reflector.hasMetadata(Types.Context.Datasource.Bindings.NAME_KEY.toString(), Test)).toBeTruthy();
			expect(Test.getName()).toBe("testing");
			expect(Utils.Decorator.Reflector.hasMetadata(Types.Context.Datasource.Bindings.CONFIG_FILENAME_KEY.toString(), Test)).toBeTruthy();
			expect(Test.getConfigFilename()).toBe("testing");
		});
	});
});