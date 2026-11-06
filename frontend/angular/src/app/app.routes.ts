import { permissionGuard } from '@abp/ng.core';
import { Routes } from '@angular/router';
import { bffAuthGuard } from './core/auth/bff-auth.guard';
import { publicHomeGuard } from './core/auth/public-home.guard';

const loadPlaceholder = () =>
  import('./shared/pages/feature-placeholder/feature-placeholder.component')
    .then(c => c.FeaturePlaceholderComponent);

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [publicHomeGuard],
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
      title: '::Menu:Workflows',
      description: '::Feature:Workflows:Description',
    },
  },
  {
    path: 'executions',
    canActivate: [bffAuthGuard],
    loadComponent: loadPlaceholder,
    data: {
      title: '::Menu:Executions',
      description: '::Feature:Executions:Description',
    },
  },
  {
    path: 'tasks',
    canActivate: [bffAuthGuard],
    loadComponent: loadPlaceholder,
    data: {
      title: '::Menu:Tasks',
      description: '::Feature:Tasks:Description',
    },
  },
  {
    path: 'approvals',
    canActivate: [bffAuthGuard],
    loadComponent: loadPlaceholder,
    data: {
      title: '::Menu:Approvals',
      description: '::Feature:Approvals:Description',
    },
  },
  {
    path: 'schedules',
    canActivate: [bffAuthGuard],
    loadComponent: loadPlaceholder,
    data: {
      title: '::Menu:Schedules',
      description: '::Feature:Schedules:Description',
    },
  },
  {
    path: 'integrations',
    canActivate: [bffAuthGuard],
    loadComponent: loadPlaceholder,
    data: {
      title: '::Menu:Integrations',
      description: '::Feature:Integrations:Description',
    },
  },
];
