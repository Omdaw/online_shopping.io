import { TestBed } from '@angular/core/testing';

import { WalletMethodsService } from './wallet-methods.service';

describe('WalletMethodsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WalletMethodsService = TestBed.get(WalletMethodsService);
    expect(service).toBeTruthy();
  });
});
