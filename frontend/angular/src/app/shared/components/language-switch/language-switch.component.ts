import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionStateService } from '@abp/ng.core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppLocalizationPipe } from '../../pipes/localization.pipe';

@Component({
  selector: 'app-language-switch',
  standalone: true,
  imports: [CommonModule, AppLocalizationPipe],
  template: `
    <div class="lang-switch" role="group" [attr.aria-label]="'::Language:selector' | appLocalization">
      <button
        type="button"
        class="lang-btn"
        [class.active]="currentLang() === 'vi'"
        (click)="switchLanguage('vi')"
        [title]="'::Language:vietnamese' | appLocalization"
        [attr.aria-label]="'::Language:switchVietnamese' | appLocalization"
      >
        VI
      </button>
      <span class="divider" aria-hidden="true">/</span>
      <button
        type="button"
        class="lang-btn"
        [class.active]="currentLang() === 'en'"
        (click)="switchLanguage('en')"
        [title]="'::Language:english' | appLocalization"
        [attr.aria-label]="'::Language:switchEnglish' | appLocalization"
      >
        EN
      </button>
    </div>
  `,
  styles: [`
    .lang-switch {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 3px 6px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }

    .lang-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      color: #64748b;
      padding: 3px 7px;
      border-radius: 5px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.04em;
      line-height: 1;
      transition: all 0.15s ease;

      &:hover:not(.active) {
        color: #0284c7;
        background: #f0f9ff;
      }

      &.active {
        color: #ffffff;
        background: #0284c7;
      }
    }

    .divider {
      color: #cbd5e1;
      font-size: 11px;
      user-select: none;
    }
  `],
})
export class LanguageSwitchComponent {
  private readonly sessionState = inject(SessionStateService);

  readonly currentLang = toSignal(this.sessionState.onLanguageChange$(), {
    initialValue: this.sessionState.getLanguage() || 'vi',
  });

  switchLanguage(lang: string): void {
    if (this.currentLang() !== lang) {
      this.sessionState.setLanguage(lang);
    }
  }
}

