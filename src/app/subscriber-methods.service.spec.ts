import { TestBed } from '@angular/core/testing';

import { SubscriberMethodsService } from './subscriber-methods.service';

describe('SubscriberMethodsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubscriberMethodsService = TestBed.get(SubscriberMethodsService);
    expect(service).toBeTruthy();
  });
});
