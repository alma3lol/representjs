import { Decorators, Core, Utils, Types } from "../..";

describe('Decorators', () => {
	describe('ORM', () => {
		it('should inject a relation into model\'s metadata', () => {
			class TestModel extends Core.Model<TestModel> { }
			class Test {
				@Decorators.ORM.relation("HasOne", {
					key: "123",
					cls: TestModel
				})
				test: TestModel;
			}
			expect(Utils.Reflector.getMetadata(Types.Bindings.Model.RELATIONS_KEY.toString(), new Test())).toBeInstanceOf(Map);
		});
	});
});