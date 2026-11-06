import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizationService } from '@abp/ng.core';
import { beforeEach, describe, expect, it } from 'vitest';
import { localizationMock, resources } from '../../../testing/localization';
import { HomeComponent } from './home.component';

describe('HomeComponent dashboard localization', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let localization: ReturnType<typeof localizationMock>;

  beforeEach(async () => {
    localization = localizationMock();
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [{ provide: LocalizationService, useValue: localization }],
    }).overrideComponent(HomeComponent, {
      set: {
        template: readFileSync(resolve(process.cwd(), 'src/app/home/home.component.html'), 'utf8'),
        styleUrls: [],
      },
    }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
  });

  it.each(['en', 'vi'])('renders all dashboard text from the %s resource', language => {
    localization.language = language;
    fixture.detectChanges();
    const view = fixture.nativeElement as HTMLElement;
    const texts = resources[language];
    expect(view.querySelector('h1')?.textContent).toBe(texts['Menu:Dashboard']);
    expect(view.querySelectorAll('.stat-card')).toHaveLength(4);
    for (const [key, value] of Object.entries(texts)) {
      if (key.startsWith('Dashboard:')) expect(view.textContent).toContain(value);
    }
    expect(view.querySelector('.stats-grid')?.getAttribute('aria-label'))
      .toBe(texts['Dashboard:Overview']);
  });

  it('updates the existing dashboard after changing language', () => {
    fixture.detectChanges();
    localization.language = 'vi';
    localization.languageChange$.next('vi');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent)
      .toBe(resources['vi']['Menu:Dashboard']);
    expect(fixture.nativeElement.querySelector('.empty-state h3').textContent)
      .toBe(resources['vi']['Dashboard:NoWorkflowsYet']);
  });
});
