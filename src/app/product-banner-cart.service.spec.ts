import { TestBed } from '@angular/core/testing';

import { ProductBannerCartService } from './product-banner-cart.service';

describe('ProductBannerCartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductBannerCartService = TestBed.get(ProductBannerCartService);
    expect(service).toBeTruthy();
  });
});
