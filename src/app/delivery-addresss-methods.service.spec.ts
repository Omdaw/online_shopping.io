import { TestBed } from '@angular/core/testing';

import { DeliveryAddresssMethodsService } from './delivery-addresss-methods.service';

describe('DeliveryAddresssMethodsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliveryAddresssMethodsService = TestBed.get(DeliveryAddresssMethodsService);
    expect(service).toBeTruthy();
  });
});
