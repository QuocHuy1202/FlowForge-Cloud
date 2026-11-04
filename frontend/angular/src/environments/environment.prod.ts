import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'https://localhost:44335/',
  redirectUri: baseUrl,
  clientId: 'FlowForge_App',
  responseType: 'code',
  scope: 'offline_access FlowForge',
  requireHttps: true,
};

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'FlowForge',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'https://localhost:44335',
      rootNamespace: 'FlowForge',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
  },
  remoteEnv: {
    url: '/getEnvConfig',
    mergeStrategy: 'deepmerge'
  }
} as Environment;
