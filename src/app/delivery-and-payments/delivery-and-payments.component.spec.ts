import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAndPaymentsComponent } from './delivery-and-payments.component';

describe('DeliveryAndPaymentsComponent', () => {
  let component: DeliveryAndPaymentsComponent;
  let fixture: ComponentFixture<DeliveryAndPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryAndPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryAndPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
