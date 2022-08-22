import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreComingSoonComponent } from './store-coming-soon.component';

describe('StoreComingSoonComponent', () => {
  let component: StoreComingSoonComponent;
  let fixture: ComponentFixture<StoreComingSoonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreComingSoonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreComingSoonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
