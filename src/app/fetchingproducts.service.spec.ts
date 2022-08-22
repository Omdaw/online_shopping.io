import { TestBed } from '@angular/core/testing';

import { FetchingproductsService } from './fetchingproducts.service';

describe('FetchingproductsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FetchingproductsService = TestBed.get(FetchingproductsService);
    expect(service).toBeTruthy();
  });
});
