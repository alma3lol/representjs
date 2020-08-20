import { Core, Decorators, Utils, Types } from "../..";

describe('Core', () => {
	describe('Model', () => {
		it('should return id property\'s value', () => {
			class Test extends Core.Model<Test> {
				@Decorators.Model.property({
					id: true,
					default: "testing"
				})
				test: string;
			}
			const testClass = new Test();
			expect(Utils.Decorator.Reflector.hasMetadata(Types.Context.Model.Bindings.ID_PROPERTY_KEY.toString(), testClass)).toBeTruthy();
			expect(testClass.ID).toBe("testing");
		});
		it('should return model\'s name', () => {
			@Decorators.model({
				name: "testing"
			})
			class Test extends Core.Model<Test> { }
			expect(Utils.Decorator.Reflector.hasMetadata(Types.Context.Model.Bindings.NAME_KEY.toString(), Test)).toBeTruthy();
			expect(Test.getName()).toBe("testing");
		});
		it('should return model\'s table', () => {
			@Decorators.model({
				table: "testing"
			})
			class Test extends Core.Model<Test> { }
			expect(Utils.Decorator.Reflector.hasMetadata(Types.Context.Model.Bindings.TABLE_KEY.toString(), Test)).toBeTruthy();
			expect(Test.getTable()).toBe("testing");
		});
		it('should return model\'s uri', () => {
			@Decorators.model({
				uri: "testing"
			})
			class Test extends Core.Model<Test> { }
			expect(Utils.Decorator.Reflector.hasMetadata(Types.Context.Model.Bindings.URI_KEY.toString(), Test)).toBeTruthy();
			expect(Test.getURI()).toBe("testing");
		});
	});
});