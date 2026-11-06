import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DynamicLayoutComponent } from '@abp/ng.core';
import { LoaderBarComponent } from '@abp/ng.theme.shared';
import { LayoutService } from '@volo/ngx-lepton-x.core';

@Component({
  selector: 'app-root',
  template: `
    <abp-loader-bar />
    <abp-dynamic-layout />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LoaderBarComponent, DynamicLayoutComponent],
  host: { '(document:click)': 'expandSidebar($event)' },
})
export class AppComponent {
  private readonly layout = inject(LayoutService);

  expandSidebar(event: MouseEvent): void {
    const target = event.target;
    if (!(target instanceof Element) || target.closest('.menu-collapse-icon')) return;
    if (target.closest('#lpx-wrapper.ff-sidebar.hover-trigger .lpx-sidebar-container')) {
      this.layout.removeClass('hover-trigger');
      this.layout.removeClass('initial-hover');
    }
  }
}
