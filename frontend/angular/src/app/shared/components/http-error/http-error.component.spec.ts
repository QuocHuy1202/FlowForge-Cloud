import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LocalizationService, SessionStateService } from '@abp/ng.core';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { localizationMock, resources } from '../../../../../testing/localization';
import { HttpErrorComponent } from './http-error.component';

describe('HttpErrorComponent localization', () => {
  let fixture: ComponentFixture<HttpErrorComponent>;
  let localization: ReturnType<typeof localizationMock>;

  beforeEach(async () => {
    localization = localizationMock('vi');
    await TestBed.configureTestingModule({
      imports: [HttpErrorComponent],
      providers: [
        provideRouter([]),
        { provide: LocalizationService, useValue: localization },
        { provide: SessionStateService, useValue: {
          getLanguage: () => 'vi',
          onLanguageChange$: () => of('vi'),
          setLanguage: vi.fn(),
        } },
      ],
    }).overrideComponent(HttpErrorComponent, {
      set: { template: readFileSync(resolve(process.cwd(), 'src/app/shared/components/http-error/http-error.component.html'), 'utf8') },
    }).compileComponents();
    fixture = TestBed.createComponent(HttpErrorComponent);
  });

  it.each([0, 401, 403, 404, 500, 502, 503, 504])('renders resource messages for status %s', status => {
    fixture.componentInstance.status.set(status);
    fixture.detectChanges();
    const key = [502, 503, 504].includes(status) ? 503 : status;
    expect(fixture.nativeElement.querySelector('.title').textContent)
      .toBe(resources['vi'][`HttpError:${key}:Title`]);
    expect(fixture.nativeElement.querySelector('.badge').textContent)
      .toContain(status === 0 ? resources['vi']['HttpError:connectionLost'] : String(status));
  });

  it('updates existing text and accessible labels when the resource language changes', () => {
    fixture.componentInstance.status.set(404);
    fixture.detectChanges();
    localization.language = 'en';
    localization.languageChange$.next('en');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.title').textContent)
      .toBe(resources['en']['HttpError:404:Title']);
    expect(fixture.nativeElement.querySelector('.lang-switch').getAttribute('aria-label'))
      .toBe(resources['en']['Language:selector']);
  });
});
