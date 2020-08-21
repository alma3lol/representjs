import { Booter } from "../../../booter";
import { Mappers } from "../../../orm";

describe('ORM', () => {
	describe('Mappers', () => {
		describe('Model', () => {
			it('should find a model using key & class', () => {
				class Test1 { }
				class Test2 { }
				const mapper = Booter.getInstance().get(Mappers.Model.key());
				mapper.bind<Test1>("123").to(new Test1());
				mapper.bind<Test1>("321").to(new Test2());
				expect(mapper.get("123")).toBeInstanceOf(Test1);
			});
		});
	});
});