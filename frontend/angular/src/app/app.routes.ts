import { authGuard, permissionGuard } from '@abp/ng.core';
import { Routes } from '@angular/router';

const loadPlaceholder = () =>
  import('./shared/pages/feature-placeholder/feature-placeholder.component')
    .then(c => c.FeaturePlaceholderComponent);

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home.component').then(c => c.HomeComponent),
  },
  {
    path: 'account',
    loadChildren: () => import('@abp/ng.account').then(c => c.createRoutes()),
  },
  {
    path: 'identity',
    loadChildren: () => import('@abp/ng.identity').then(c => c.createRoutes()),
  },
  {
    path: 'tenant-management',
    loadChildren: () => import('@abp/ng.tenant-management').then(c => c.createRoutes()),
  },
  {
    path: 'setting-management',
    loadChildren: () => import('@abp/ng.setting-management').then(c => c.createRoutes()),
  },
  {
    path: 'workflows',
    loadComponent: loadPlaceholder,
    data: {
      title: 'Workflows',
      description: 'Design and manage your workflows.',
    },
  },
  {
    path: 'executions',
    loadComponent: loadPlaceholder,
    data: {
      title: 'Executions',
      description: 'Monitor workflow execution history.',
    },
  },
  {
    path: 'tasks',
    loadComponent: loadPlaceholder,
    data: {
      title: 'My Tasks',
      description: 'View and manage assigned tasks.',
    },
  },
  {
    path: 'approvals',
    loadComponent: loadPlaceholder,
    data: {
      title: 'Approvals',
      description: 'Review and process approval requests.',
    },
  },
  {
    path: 'schedules',
    loadComponent: loadPlaceholder,
    data: {
      title: 'Schedules',
      description: 'Manage scheduled workflow executions.',
    },
  },
  {
    path: 'integrations',
    loadComponent: loadPlaceholder,
    data: {
      title: 'Integrations',
      description: 'Connect external systems and services.',
    },
  },
];
