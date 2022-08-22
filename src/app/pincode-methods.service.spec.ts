import { TestBed } from '@angular/core/testing';

import { PincodeMethodsService } from './pincode-methods.service';

describe('PincodeMethodsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PincodeMethodsService = TestBed.get(PincodeMethodsService);
    expect(service).toBeTruthy();
  });
});
