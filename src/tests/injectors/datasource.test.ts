import { Core, Injectors } from "../..";
import { Class } from '../../types/common.types';
import { Filter, Where } from '../../types/thirdparty';

describe('Injectors', () => {
	describe('Datasource', () => {
		it('should inject datasource into a property', () => {
			class TestDS extends Core.Datasource {
				find<T extends Core.Model<T>>(cls: Class<T>, filter: Filter<T>): Promise<T[]> {
					throw new Error("Method not implemented.");
				}
				findById<T extends Core.Model<T>>(cls: Class<T>, id: string | number): Promise<T | undefined> {
					throw new Error("Method not implemented.");
				}
				create<T extends Core.Model<T>>(cls: Class<T>, data: Partial<T>): Promise<T> {
					throw new Error("Method not implemented.");
				}
				delete<T extends Core.Model<T>>(cls: Class<T>, idOrFilter: string | number | Where<T>): Promise<boolean> {
					throw new Error("Method not implemented.");
				}
				update<T extends Core.Model<T>>(cls: Class<T>, data: Partial<T>, idOrFilter: string | number | Where<T>): Promise<number> {
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