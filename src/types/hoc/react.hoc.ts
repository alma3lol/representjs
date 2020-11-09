import { Core, Datasources } from '../..'

export namespace React {
	export type WithService = {
		service: Core.Service
	}
	export type WithRepository = {
		repository: Core.Repository
	}
}