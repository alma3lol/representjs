import { Decorators, Utils, Types } from '../..';

describe('Decorators', () => {
	describe('Model', () => {
		it('should decorate models', () => {
			@Decorators.model({
				name: "test"
			})
			class Test { }
			expect(Utils.Reflector.hasMetadata(Types.Bindings.Model.NAME_KEY.toString(), Test)).toBeTruthy();
		});
		it('should configure models', () => {
			@Decorators.Model.config({
				name: "test"
			})
			class Test { }
			expect(Utils.Reflector.hasMetadata(Types.Bindings.Model.NAME_KEY.toString(), Test)).toBeTruthy();
		});
		it('should decorate class\'s property', () => {
			class Test {
				@Decorators.Model.property({
					id: true,
					default: 'testing'
				})
				test: string;
			}
			expect(Utils.Reflector.hasMetadata(Types.Bindings.Model.ID_PROPERTY_KEY.toString(), new Test())).toBeTruthy();
			expect(new Test().test).toBe("testing");
		});
	});
});