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
			expect(testClass.ID_PROPERTY).toBe("testing");
		});
		it('should return name, table, uri & properties using static/non-static methods', () => {
			expect(Test.getName()).toBe("Test");
			expect(testClass.ModelName).toBe("Test");
			expect(testClass.ModelTable).toBe("table");
			expect(testClass.ModelURI).toBe("uri");
			expect(Test.getSubKey(testClass.ModelName, Types.Bindings.Model.ID_PROPERTY_KEY)?.value).toBe("test");
		});
		it('should convert model to object', () => {
			expect(testClass.toObject()).toEqual({ test: "testing" });
		});
	});
});