import { AxiosRequestConfig } from 'axios';
import { DexieOptions } from 'dexie';
import React from 'react';
import { Core, Datasources } from '..';
import { DatasourcesType, HoCType } from '../types';

class Context {
	service: Core.Service;
	repository: Core.Repository;
	initServiceDatasource = (config?: AxiosRequestConfig) => {
		this.service = new Core.Service(
			new Datasources.API(config)
		);
	}
	initRepositoryDatasource = (config: DatasourcesType.Dexie.Config, options?: DexieOptions) => {
		this.repository = new Core.Repository(
			new Datasources.Dexie(config, options)
		);
	}
}

export const context = new Context();

export const withService = <P extends HoCType.React.WithService = HoCType.React.WithService>(Component: React.ComponentType<P>): React.ComponentType<Omit<P, keyof HoCType.React.WithService>> =>
	(props: Omit<P, keyof HoCType.React.WithService>) =>
		<Component {...(props as P)} service={context.service} />

export const withRepository = <P extends HoCType.React.WithService = HoCType.React.WithService>(Component: React.ComponentType<P>): React.ComponentType<Omit<P, keyof HoCType.React.WithRepository>> =>
	(props: Omit<P, keyof HoCType.React.WithRepository>) =>
		<Component {...(props as P)} repository={context.repository} />