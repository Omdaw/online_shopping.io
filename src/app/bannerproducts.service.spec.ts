import { TestBed } from '@angular/core/testing';

import { BannerproductsService } from './bannerproducts.service';

describe('BannerproductsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BannerproductsService = TestBed.get(BannerproductsService);
    expect(service).toBeTruthy();
  });
});
