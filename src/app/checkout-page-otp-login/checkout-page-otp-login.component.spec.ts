import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutPageOtpLoginComponent } from './checkout-page-otp-login.component';

describe('CheckoutPageOtpLoginComponent', () => {
  let component: CheckoutPageOtpLoginComponent;
  let fixture: ComponentFixture<CheckoutPageOtpLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutPageOtpLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPageOtpLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
