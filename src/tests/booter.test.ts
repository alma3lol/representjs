import { Booter, Types } from "..";

describe('Booter', () => {
	it('should bind project root to core context when booted', () => {
		const booter = Booter.getInstance()
		booter.project_root = __dirname;
		booter.boot();
		expect(booter.get(Types.Bindings.Core.PROJECT_ROOT_KEY)).toBe(__dirname);
	});
});