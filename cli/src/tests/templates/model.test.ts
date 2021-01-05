import { ModelTemplate } from '../../templates';

describe("Templates", () => {
	describe("Model", () => {
		it("should generate a model template", () => {
			const template = new ModelTemplate({
				name: "Test",
				uri: "test",
				table: "test",
				properties: [
					{
						name: "id",
						type: "string",
						id: true,
						required: true
					},
					{
						name: "test",
						type: "string"
					},
					{
						name: "testArr",
						type: "array",
						arrType: "string"
					}
				],
				relations: [
					{
						name: "testid",
						model: "AnotherTest",
						key: "testid",
						relationship: "hasOne",
						type: "model",
					},
					{
						name: "tests",
						model: "AnotherTests",
						key: "tests",
						relationship: "hasMany",
						type: "array"
					},
					{
						name: "testId",
						model: "TestParent",
						key: "parentId",
						relationship: "belongsTo",
						type: "string"
					}
				]
			});
			expect(template.generate()).toEqual(`import { Core, Decorators } from '@alma3lol/represent';
import { AnotherTest } from './another-test.model';
import { AnotherTests } from './another-tests.model';
import { TestParent } from './test-parent.model';

export interface TestProps {
	id: string
	test?: string
	testArr?: string[]
}

export interface TestRelations {
	testid: AnotherTest
	tests: AnotherTests[]
	testId: string
}

@Decorators.model({
	uri: 'test',
	table: 'test'
})
export class Test extends Core.Model<Test> {
	constructor(data: TestProps) {
		super(data);
		Object.assign(this, data);
	}
	@Decorators.Model.ID({
		type: String
	})
	id!: string;
	@Decorators.Model.property()
	test?: string;
	@Decorators.Model.property()
	testArr?: string[];
	@Decorators.ORM.Relation.hasOne({
		cls: AnotherTest,
		key: 'testid'
	})
	testid!: AnotherTest;
	@Decorators.ORM.Relation.hasMany({
		cls: AnotherTests,
		key: 'tests'
	})
	tests!: AnotherTests[];
	@Decorators.ORM.Relation.belongsTo({
		cls: TestParent,
		key: 'parentId'
	})
	testId!: string;
}`);
		});
		it("should render a model template", () => {
			const template = `import { Core, Decorators } from '@alma3lol/represent';
import { AnotherTest } from './another-test.model';
import { AnotherTests } from './another-tests.model';
import { TestParent } from './test-parent.model';

export interface TestProps {
	id: string
	test?: string
}

export interface TestRelations {
	testid: AnotherTest
	tests: AnotherTest[]
	testId: string
}

@Decorators.model({
	uri: 'test',
	table: 'test'
})
export class Test extends Core.Model<Test> {
	constructor(data: TestProps) {
		super(data);
		Object.assign(this, data);
	}
	@Decorators.Model.ID({
		type: String
	})
	id!: string;
	@Decorators.Model.property()
	test?: string;
	@Decorators.Model.property()
	testArr?: string[];
	@Decorators.ORM.Relation.hasOne({
		cls: AnotherTest,
		key: 'testid'
	})
	test!: string;
	@Decorators.ORM.Relation.hasMany({
		cls: AnotherTests,
		key: 'tests'
	})
	tests!: AnotherTests[];
	@Decorators.ORM.Relation.belongsTo({
		cls: TestParent,
		key: 'parentId'
	})
	testId!: string;
}`;
			const expected = new ModelTemplate({
				table: "test",
				uri: "test",
				name: "Test",
				relations: [
					{
						name: "test",
						model: "AnotherTest",
						key: "testid",
						relationship: "hasOne",
						type: "model",
					},
					{
						name: "tests",
						model: "AnotherTests",
						key: "tests",
						relationship: "hasMany",
						type: "array"
					},
					{
						name: "testId",
						model: "TestParent",
						key: "parentId",
						relationship: "belongsTo",
						type: "string"
					}
				],
				properties: [
					{
						name: "id",
						type: "string",
						id: true,
						required: true
					},
					{
						type: "string",
						name: "test"
					},
					{
						type: "array",
						name: "testArr",
						arrType: "string"
					}
				]
			});
			expect(
				JSON.parse(
					JSON.stringify(ModelTemplate.render(template))
				)
			).toEqual(
				JSON.parse(
					JSON.stringify(expected)
				)
			);
		});
	});
});
