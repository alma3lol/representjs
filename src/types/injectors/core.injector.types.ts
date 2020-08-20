import * as Context from '../../context';

export namespace Core {
	export type ContextTypes =
		Context.Core |
		Context.Datasource |
		Context.Model |
		Context.Repository |
		Context.Service;
}