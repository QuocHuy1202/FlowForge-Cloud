import { RoutesService, eLayoutType } from '@abp/ng.core';
import { inject, provideAppInitializer } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  provideAppInitializer(() => {
    configureRoutes();
  }),
];

function configureRoutes() {
  const routes = inject(RoutesService);

  routes.add([
    {
      path: '/',
      name: '::Menu:Home',
      layout: eLayoutType.empty,
      invisible: true,
    },
    {
      path: '/login',
      name: '::Login:signIn',
      layout: eLayoutType.empty,
      invisible: true,
    },
    {
      path: '/register',
      name: '::Register:createAccount',
      layout: eLayoutType.empty,
      invisible: true,
    },
    {
      path: '/dashboard',
      name: '::Menu:Dashboard',
      iconClass: 'fas fa-chart-line',
      order: 1,
      layout: eLayoutType.application,
    },
    {
      path: '/workflows',
      name: '::Menu:Workflows',
      iconClass: 'fas fa-project-diagram',
      order: 2,
      layout: eLayoutType.application,
    },
    {
      path: '/executions',
      name: '::Menu:Executions',
      iconClass: 'fas fa-play-circle',
      order: 3,
      layout: eLayoutType.application,
    },
    {
      path: '/tasks',
      name: '::Menu:Tasks',
      iconClass: 'fas fa-tasks',
      order: 4,
      layout: eLayoutType.application,
    },
    {
      path: '/approvals',
      name: '::Menu:Approvals',
      iconClass: 'fas fa-check-circle',
      order: 5,
      layout: eLayoutType.application,
    },
    {
      path: '/schedules',
      name: '::Menu:Schedules',
      iconClass: 'fas fa-calendar-alt',
      order: 6,
      layout: eLayoutType.application,
    },
    {
      path: '/integrations',
      name: '::Menu:Integrations',
      iconClass: 'fas fa-plug',
      order: 7,
      layout: eLayoutType.application,
    },
  ]);
}
