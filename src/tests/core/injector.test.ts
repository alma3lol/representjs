import { Core, Types } from "../..";

describe('Core', () => {
	describe('Injector', () => {
		it('should inject a class to a property via class constructor', () => {
			class TestClass { }
			class Test {
				@Core.Injector.createClassInjector(TestClass)
				testClass: TestClass;
			}
			const testInstance = new Test();
			expect(testInstance.testClass).toBeInstanceOf(TestClass);
		});
	});
});