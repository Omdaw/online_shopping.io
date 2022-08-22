import { TestBed } from '@angular/core/testing';

import { SocialSignupService } from './social-signup.service';

describe('SocialSignupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocialSignupService = TestBed.get(SocialSignupService);
    expect(service).toBeTruthy();
  });
});
