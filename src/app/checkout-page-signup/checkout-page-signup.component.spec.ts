import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutPageSignupComponent } from './checkout-page-signup.component';

describe('CheckoutPageSignupComponent', () => {
  let component: CheckoutPageSignupComponent;
  let fixture: ComponentFixture<CheckoutPageSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutPageSignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPageSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
