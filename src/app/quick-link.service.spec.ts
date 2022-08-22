import { TestBed } from '@angular/core/testing';

import { QuickLinkService } from './quick-link.service';

describe('QuickLinkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuickLinkService = TestBed.get(QuickLinkService);
    expect(service).toBeTruthy();
  });
});
