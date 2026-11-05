import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [provideRouter([])],
    })
      .overrideComponent(RegisterComponent, {
        set: { template: '<form [formGroup]="form"></form>', styleUrls: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
  });

  it('should initialize with invalid form state', () => {
    expect(component).toBeTruthy();
    expect(component.form.valid).toBe(false);
  });

  it('should validate required fields', () => {
    const userNameControl = component.form.controls.userName;
    const emailControl = component.form.controls.emailAddress;

    expect(userNameControl.valid).toBe(false);
    expect(emailControl.valid).toBe(false);

    userNameControl.setValue('johndoe');
    emailControl.setValue('invalid-email');
    expect(emailControl.valid).toBe(false);

    emailControl.setValue('john@example.com');
    expect(emailControl.valid).toBe(true);
  });

  it('should toggle password visibility flags', () => {
    expect(component.showPassword).toBe(false);
    component.showPassword = true;
    expect(component.showPassword).toBe(true);

    expect(component.showConfirmPassword).toBe(false);
    component.showConfirmPassword = true;
    expect(component.showConfirmPassword).toBe(true);
  });
});
