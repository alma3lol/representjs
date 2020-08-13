import { Booter, Types } from "..";

describe('Booter', () => {
	it('should bind project root to core context when booted', () => {
		const booter = Booter.getInstance()
		booter.project_root = __dirname;
		booter.boot();
		const ctx = booter.get(Types.Booter.Bindings.CORE_CONTEXT_KEY);
		expect(ctx.get(Types.Context.Core.Bindings.PROJECT_ROOT_KEY)).toBe(__dirname);
	});
});