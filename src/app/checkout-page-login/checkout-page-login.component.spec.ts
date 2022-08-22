import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutPageLoginComponent } from './checkout-page-login.component';

describe('CheckoutPageLoginComponent', () => {
  let component: CheckoutPageLoginComponent;
  let fixture: ComponentFixture<CheckoutPageLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutPageLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPageLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
