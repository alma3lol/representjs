import { Injectors, Booter } from "../..";
import { String } from "lodash";

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
		it('should inject a key\'s value to a property', () => {
			Booter.getInstance().bind("123").to("123");
			class Test {
				@Injectors.Core.binding("123")
				test: string;
			}
			const testClass = new Test();
			expect(testClass.test).toBe("123");
		});
	});
});