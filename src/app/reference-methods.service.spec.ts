import { TestBed } from '@angular/core/testing';

import { ReferenceMethodsService } from './reference-methods.service';

describe('ReferenceMethodsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReferenceMethodsService = TestBed.get(ReferenceMethodsService);
    expect(service).toBeTruthy();
  });
});
