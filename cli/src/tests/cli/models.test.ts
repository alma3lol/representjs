import { Models } from '../../cli';

describe("CLI", () => {
	describe("Models", () => {
		it("should return a file name from model name", () => {
			const result = Models.generateFileName("TestModel");
			expect(result).toEqual("test-model.model");
		});
		it("should return a table name from model name", () => {
			const result = Models.generateTableName("TestModel");
			expect(result).toEqual("test_model");
		});
		it("should return a list of already existing models", () => {
			const input = ["test.model.ts", "another-test.model.ts", "another-tests.model.ts"];
			const result = Models.renderModelsList(input);
			const expected = ["Test", "AnotherTest", "AnotherTests"];
			expect(result).toEqual(expected);
		});
		it("should append model to index", () => {
			const result = Models.appendModelToIndex("", "Test");
			const expected = `export * from './test.model';`;
			expect(result).toEqual(expected);
		});
		it("should remove model from index", () => {
			const result = Models.removeModelFromIndex(`export * from './tests.model';\nexport * from './test.model';\nexport * from './model.model';`, "Test");
			const expected = `export * from './tests.model';\nexport * from './model.model';`;
			expect(result).toEqual(expected);
		});
	});
});
