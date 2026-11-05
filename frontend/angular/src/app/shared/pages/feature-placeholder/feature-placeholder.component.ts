
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-feature-placeholder',
    standalone: true,
    template: `
    <main class="container-fluid py-4">
      <h1 class="fw-bold mb-2">{{ page()['title'] }}</h1>
      <p class="text-muted">{{ page()['description'] }}</p>

      <section class="card mt-4">
        <div class="card-body p-5 text-center">
          <h2 class="h5">Coming soon</h2>
          <p class="text-muted mb-0">
            This FlowForge module is under development.
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
