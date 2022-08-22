import { TestBed } from '@angular/core/testing';

import { ProductsMidLayerService } from './products-mid-layer.service';

describe('ProductsMidLayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductsMidLayerService = TestBed.get(ProductsMidLayerService);
    expect(service).toBeTruthy();
  });
});
