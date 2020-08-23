import { Core, Decorators, Types } from "../..";

describe('Core', () => {
	describe('Model', () => {
		@Decorators.model({
			table: "table",
			uri: "uri"
		})
		class Test extends Core.Model<Test> {
			@Decorators.Model.ID({
				type: String,
				default: "testing"
			})
			test: string;
		}
		const testClass = new Test();
		it('should return id property\'s value', () => {
			expect(testClass.ID).toBe("testing");
		});
		it('should return name, table, uri & properties using static methods', () => {
			expect(Test.getName()).toBe("Test");
			expect(testClass.Name).toBe("Test");
			expect(testClass.Table).toBe("table");
			expect(testClass.URI).toBe("uri");
			expect(Test.getSubKey(testClass.Name, Types.Bindings.Model.ID_PROPERTY_KEY)?.value).toBe("test");
		});
	});
});