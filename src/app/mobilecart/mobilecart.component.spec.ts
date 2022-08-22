import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilecartComponent } from './mobilecart.component';

describe('MobilecartComponent', () => {
  let component: MobilecartComponent;
  let fixture: ComponentFixture<MobilecartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobilecartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobilecartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
