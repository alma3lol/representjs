import { Booter } from "../../../booter";
import { Mappers } from "../../../orm";
import { Model } from "../../../core";

describe('ORM', () => {
	describe('Mappers', () => {
		describe('Model', () => {
			it('should find a model using key & class', () => {
				class Test extends Model<Test> {
					something: string;
				}
				const mapper = Booter.getInstance().get(Mappers.Model.key());
				const testClass = new Test({
					something: "123"
				});
				mapper.bind<Test>("123").to(testClass);
				const result = mapper.find("something", "123", Test);
				expect(result).toBeInstanceOf(Test);
				expect(result.something).toBe("123");
				expect(result).toEqual(testClass);
			});
		});
	});
});