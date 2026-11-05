import { permissionGuard } from '@abp/ng.core';
import { Routes } from '@angular/router';
import { bffAuthGuard } from './core/auth/bff-auth.guard';

const loadPlaceholder = () =>
  import('./shared/pages/feature-placeholder/feature-placeholder.component')
    .then(c => c.FeaturePlaceholderComponent);

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./public/home/public-home.component')
        .then(c => c.PublicHomeComponent),
  },
  {
    path: 'dashboard',
    canActivate: [bffAuthGuard],
    loadComponent: () =>
      import('./home/home.component')
        .then(c => c.HomeComponent),
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
    path: 'login',
    loadComponent: () =>
      import('./public/login/login.component')
        .then(c => c.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./public/register/register.component')
        .then(c => c.RegisterComponent),
  },
  {
    path: 'workflows',
    canActivate: [bffAuthGuard],
    loadComponent: loadPlaceholder,
    data: {
      title: 'Workflows',
      description: 'Design and manage your workflows.',
    },
  },
  {
    path: 'executions',
    canActivate: [bffAuthGuard],
    loadComponent: loadPlaceholder,
    data: {
      title: 'Executions',
      description: 'Monitor workflow execution history.',
    },
  },
  {
    path: 'tasks',
    canActivate: [bffAuthGuard],
    loadComponent: loadPlaceholder,
    data: {
      title: 'My Tasks',
      description: 'View and manage assigned tasks.',
    },
  },
  {
    path: 'approvals',
    canActivate: [bffAuthGuard],
    loadComponent: loadPlaceholder,
    data: {
      title: 'Approvals',
      description: 'Review and process approval requests.',
    },
  },
  {
    path: 'schedules',
    canActivate: [bffAuthGuard],
    loadComponent: loadPlaceholder,
    data: {
      title: 'Schedules',
      description: 'Manage scheduled workflow executions.',
    },
  },
  {
    path: 'integrations',
    canActivate: [bffAuthGuard],
    loadComponent: loadPlaceholder,
    data: {
      title: 'Integrations',
      description: 'Connect external systems and services.',
    },
  },
];
