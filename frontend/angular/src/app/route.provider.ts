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
      name: 'Public Home',
      layout: eLayoutType.empty,
      invisible: true,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      iconClass: 'fas fa-chart-line',
      order: 1,
      layout: eLayoutType.application,
    },
    {
      path: '/login',
      name: 'Login',
      layout: eLayoutType.empty,
      invisible: true,
    },



  ]);
}
