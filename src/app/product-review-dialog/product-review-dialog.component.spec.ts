import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductReviewDialogComponent } from './product-review-dialog.component';

describe('ProductReviewDialogComponent', () => {
  let component: ProductReviewDialogComponent;
  let fixture: ComponentFixture<ProductReviewDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductReviewDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductReviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
