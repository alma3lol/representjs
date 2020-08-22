import { Booter } from "../../../booter";
import { Mappers } from "../../../orm";
import { Model } from "../../../core";

describe('ORM', () => {
	describe('Mappers', () => {
		describe('Model', () => {
			const mapper = Booter.getInstance().get(Mappers.Model.key());
			afterEach(() => {
				mapper.clear();
			})
			it('should find a model using keys & class', () => {
				class Test extends Model<Test> {
					something: string;
				}
				const testClass = new Test({
					something: "123"
				});
				mapper.bind<Test>("123").to(testClass);
				const result = mapper.find(Test, "something", "123");
				expect(result).toBeInstanceOf(Test);
				expect(result?.something).toBe("123");
				expect(result).toEqual(testClass);
			});
			it('should find models using iterator function & class', () => {
				class Test extends Model<Test> {
					something: string;
				}
				mapper.bind("123").to(new Test({
					something: "123"
				}));
				mapper.bind("321").to(new Test({
					something: "123"
				}));
				const result = mapper.findMany(Test, "something", "123");
				expect(result.length).toBe(2);
			});
		});
	});
});