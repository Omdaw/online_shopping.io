import { TestBed } from '@angular/core/testing';

import { WlletService } from './wllet.service';

describe('WlletService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WlletService = TestBed.get(WlletService);
    expect(service).toBeTruthy();
  });
});
