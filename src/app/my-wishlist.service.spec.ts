import { TestBed } from '@angular/core/testing';

import { MyWishlistService } from './my-wishlist.service';

describe('MyWishlistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyWishlistService = TestBed.get(MyWishlistService);
    expect(service).toBeTruthy();
  });
});
