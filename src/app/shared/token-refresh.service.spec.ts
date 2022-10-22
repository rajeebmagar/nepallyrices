import { TestBed, inject } from '@angular/core/testing';

import { TokenRefreshService } from './token-refresh.service';

describe('TokenRefreshService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TokenRefreshService]
    });
  });

  it('should be created', inject([TokenRefreshService], (service: TokenRefreshService) => {
    expect(service).toBeTruthy();
  }));
});
