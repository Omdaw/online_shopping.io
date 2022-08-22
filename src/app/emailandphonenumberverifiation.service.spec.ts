import { TestBed } from '@angular/core/testing';

import { EmailandphonenumberverifiationService } from './emailandphonenumberverifiation.service';

describe('EmailandphonenumberverifiationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmailandphonenumberverifiationService = TestBed.get(EmailandphonenumberverifiationService);
    expect(service).toBeTruthy();
  });
});
