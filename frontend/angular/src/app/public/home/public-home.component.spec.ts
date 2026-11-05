import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { PublicHomeComponent } from './public-home.component';

describe('PublicHomeComponent', () => {
  let component: PublicHomeComponent;
  let fixture: ComponentFixture<PublicHomeComponent>;

  const publicHomeTemplate = `
    <nav class="public-nav">
      <div class="brand-name">FlowForge Cloud</div>
      <a routerLink="/login">Sign In</a>
      <a routerLink="/register">Create Account</a>
    </nav>
  `;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicHomeComponent],
      providers: [provideRouter([])],
    })
      .overrideComponent(PublicHomeComponent, {
        set: { template: publicHomeTemplate, styleUrls: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PublicHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and render brand heading', () => {
    expect(component).toBeTruthy();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand-name')?.textContent).toContain('FlowForge Cloud');
  });

  it('should render navigation call-to-actions', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const links = compiled.querySelectorAll('a');
    const linkTexts = Array.from(links).map(l => l.textContent?.trim());

    expect(linkTexts.some(t => t?.includes('Sign In'))).toBe(true);
    expect(linkTexts.some(t => t?.includes('Create Account'))).toBe(true);
  });
});
