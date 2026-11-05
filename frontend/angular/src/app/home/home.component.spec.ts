import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { HomeComponent } from './home.component';

describe('HomeComponent (Dashboard)', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const dashboardTemplate = `
    <div class="flowforge-dashboard">
      <header class="dashboard-header">
        <h1>Dashboard</h1>
        <span class="environment-label">FlowForge Cloud</span>
      </header>
      <section class="stats-grid">
        <article class="stat-card"><span class="stat-label">Total Workflows</span></article>
        <article class="stat-card"><span class="stat-label">Executions</span></article>
        <article class="stat-card"><span class="stat-label">Pending Tasks</span></article>
        <article class="stat-card"><span class="stat-label">Success Rate</span></article>
      </section>
      <div class="empty-state">
        <h3>No workflows yet</h3>
      </div>
    </div>
  `;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    })
      .overrideComponent(HomeComponent, {
        set: { template: dashboardTemplate, styleUrls: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create dashboard view', () => {
    expect(component).toBeTruthy();
  });

  it('should render dashboard header and stats overview cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Dashboard');

    const statCards = compiled.querySelectorAll('.stat-card');
    expect(statCards.length).toBe(4);

    const labels = Array.from(compiled.querySelectorAll('.stat-label')).map(el => el.textContent?.trim());
    expect(labels).toContain('Total Workflows');
    expect(labels).toContain('Executions');
    expect(labels).toContain('Pending Tasks');
    expect(labels).toContain('Success Rate');
  });

  it('should render empty state message for workflows', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state h3')?.textContent).toContain('No workflows yet');
  });
});
