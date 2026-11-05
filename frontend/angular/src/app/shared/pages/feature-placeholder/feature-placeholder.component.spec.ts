import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { FeaturePlaceholderComponent } from './feature-placeholder.component';

describe('FeaturePlaceholderComponent', () => {
  let component: FeaturePlaceholderComponent;
  let fixture: ComponentFixture<FeaturePlaceholderComponent>;

  const mockRouteData = {
    title: 'Workflows',
    description: 'Design and manage your workflows.',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturePlaceholderComponent],
      providers: [
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

  it('should display title and description from route data', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Workflows');
    expect(compiled.querySelector('p')?.textContent).toContain('Design and manage your workflows.');
    expect(compiled.querySelector('h2')?.textContent).toContain('Coming soon');
  });
});

