import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LanguageSwitchComponent } from '../language-switch/language-switch.component';
import { AppLocalizationPipe } from '../../pipes/localization.pipe';

@Component({
  selector: 'app-http-error',
  standalone: true,
  imports: [CommonModule, LanguageSwitchComponent, AppLocalizationPipe],
  templateUrl: './http-error.component.html',
  styleUrls: ['./http-error.component.scss'],
})
export class HttpErrorComponent {
  private readonly router = inject(Router);

  // Injected by ABP's HttpErrorWrapperComponent
  status = signal<number>(0);
  errorStatus?: number;
  destroy$?: Subject<void>;

  readonly currentStatus = computed(() => {
    return this.status() || this.errorStatus || 0;
  });

  readonly displayCode = computed(() => {
    const s = this.currentStatus();
    if (s === 0) return 'ERR';
    return String(s);
  });

  readonly errorKey = computed(() => {
    const status = this.currentStatus();
    if ([502, 503, 504].includes(status)) return '503';
    return [401, 403, 404, 500].includes(status) ? String(status) : '0';
  });

  onReload(): void {
    window.location.reload();
  }

  onGoHome(): void {
    this.router.navigateByUrl('/', { onSameUrlNavigation: 'reload' });
    this.close();
  }

  close(): void {
    if (this.destroy$) {
      this.destroy$.next();
      this.destroy$.complete();
    }
  }
}
