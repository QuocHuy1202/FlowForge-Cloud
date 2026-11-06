
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppLocalizationPipe } from '../../pipes/localization.pipe';

@Component({
    selector: 'app-feature-placeholder',
    standalone: true,
    imports: [AppLocalizationPipe],
    template: `
    <main class="container-fluid py-4">
      <h1 class="fw-bold mb-2">{{ page()['title'] | appLocalization }}</h1>
      <p class="text-muted">{{ page()['description'] | appLocalization }}</p>

      <section class="card mt-4">
        <div class="card-body p-5 text-center">
          <h2 class="h5">{{ '::Feature:ComingSoon' | appLocalization }}</h2>
          <p class="text-muted mb-0">
            {{ '::Feature:UnderDevelopment' | appLocalization }}
          </p>
        </div>
      </section>
    </main>
  `,
})
export class FeaturePlaceholderComponent {
    private readonly route = inject(ActivatedRoute);

    readonly page = toSignal(this.route.data, {
        initialValue: this.route.snapshot.data,
    });
}
