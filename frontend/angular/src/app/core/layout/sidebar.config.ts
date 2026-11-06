import { inject, provideAppInitializer } from '@angular/core';
import { LayoutService } from '@volo/ngx-lepton-x.core';

export const SIDEBAR_PROVIDER = provideAppInitializer(() => {
  inject(LayoutService).addClass('ff-sidebar');
});
