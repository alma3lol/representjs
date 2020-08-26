import { Utils, Types, Decorators, Core } from "../..";

describe('Core', () => {
	describe('Datasource', () => {
		it('should return datasource\'s name', () => {
			class Test extends Core.Datasource {
				find<T extends Core.Model<T>>(cls: Types.Common.Class<T>, filter: Types.Thirdparty.Filter<T>): Promise<T[]> {
					throw new Error("Method not implemented.");
				}
				findById<T extends Core.Model<T>>(cls: Types.Common.Class<T>, id: string | number): Promise<T | undefined> {
					throw new Error("Method not implemented.");
				}
				create<T extends Core.Model<T>>(cls: Types.Common.Class<T>, data: Partial<T>): Promise<T> {
					throw new Error("Method not implemented.");
				}
				delete<T extends Core.Model<T>>(cls: Types.Common.Class<T>, idOrFilter: string | number | Types.Thirdparty.Where<T>): Promise<boolean> {
					throw new Error("Method not implemented.");
				}
				update<T extends Core.Model<T>>(cls: Types.Common.Class<T>, data: Partial<T>, idOrFilter: string | number | Types.Thirdparty.Where<T>): Promise<number> {
					throw new Error("Method not implemented.");
				}
			}
			expect(Test.getName()).toBe("Test");
			expect(new Test({}).Name).toBe("Test");
		});
	});
});