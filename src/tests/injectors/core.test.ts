import { Injectors, Booter, Context } from "../..";

describe('Injectors', () => {
	describe('Core', () => {
		it('should inject booter to a property', () => {
			class Test {
				@Injectors.Core.booter()
				booter: Booter;
			}
			const testClass = new Test();
			expect(testClass.booter).toBeInstanceOf(Booter);
		});
		it('should inject context to a property', () => {
			class Test {
				@Injectors.context(Context.Core)
				ctx: Context.Core;
			}
			const testClass = new Test();
			expect(testClass.ctx).toBeInstanceOf(Context.Core);
		});
	});
});