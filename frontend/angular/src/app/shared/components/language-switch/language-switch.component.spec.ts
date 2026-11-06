import { localizationMock } from '../../../../../testing/localization';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SessionStateService, LocalizationService } from '@abp/ng.core';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest';
import { LanguageSwitchComponent } from './language-switch.component';

describe('LanguageSwitchComponent', () => {
  let component: LanguageSwitchComponent;
  let fixture: ComponentFixture<LanguageSwitchComponent>;
  let mockSessionState: Partial<SessionStateService>;

  beforeEach(async () => {
    mockSessionState = {
      getLanguage: vi.fn().mockReturnValue('vi'),
      onLanguageChange$: vi.fn().mockReturnValue(of('vi')),
      setLanguage: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LanguageSwitchComponent],
      providers: [
        { provide: LocalizationService, useValue: localizationMock() },
        { provide: SessionStateService, useValue: mockSessionState },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LanguageSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call setLanguage when switching to a different language', () => {
    component.switchLanguage('en');
    expect(mockSessionState.setLanguage).toHaveBeenCalledWith('en');
  });

  it('should not call setLanguage if already on the same language', () => {
    component.switchLanguage('vi');
    expect(mockSessionState.setLanguage).not.toHaveBeenCalled();
  });
});

