import { ChangeDetectorRef, Pipe, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocalizationPipe, LocalizationService } from '@abp/ng.core';

// This ABP version's pipe is pure. Re-evaluate unchanged keys after a language
// switch so existing views also display the newly loaded resource values.
@Pipe({ name: 'appLocalization', standalone: true, pure: false })
export class AppLocalizationPipe extends LocalizationPipe {
  constructor() {
    super();
    const changeDetector = inject(ChangeDetectorRef);
    inject(LocalizationService).languageChange$
      .pipe(takeUntilDestroyed())
      .subscribe(() => changeDetector.markForCheck());
  }
}
