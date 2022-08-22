import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosOneComponent } from './pos-one.component';

describe('PosOneComponent', () => {
  let component: PosOneComponent;
  let fixture: ComponentFixture<PosOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
