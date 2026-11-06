import { LocalizationService } from '@abp/ng.core';
import { localizationMock, resources } from '../../../../../testing/localization';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { FeaturePlaceholderComponent } from './feature-placeholder.component';

describe('FeaturePlaceholderComponent', () => {
  let localization: ReturnType<typeof localizationMock>;
  let component: FeaturePlaceholderComponent;
  let fixture: ComponentFixture<FeaturePlaceholderComponent>;

  const mockRouteData = {
    title: '::Menu:Workflows',
    description: '::Feature:Workflows:Description',
  };

  beforeEach(async () => {
    localization = localizationMock();
    await TestBed.configureTestingModule({
      imports: [FeaturePlaceholderComponent],
      providers: [
        { provide: LocalizationService, useValue: localization },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of(mockRouteData),
            snapshot: { data: mockRouteData },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturePlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create placeholder view', () => {
    expect(component).toBeTruthy();
  });

  it.each(['en', 'vi'])('localizes route data and placeholder content in %s', language => {
    localization.language = language;
    localization.languageChange$.next(language);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(resources[language]['Menu:Workflows']);
    expect(compiled.querySelector('p')?.textContent).toContain(resources[language]['Feature:Workflows:Description']);
    expect(compiled.querySelector('h2')?.textContent).toContain(resources[language]['Feature:ComingSoon']);
  });
});

