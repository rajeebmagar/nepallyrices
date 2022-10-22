import { TestBed, inject } from '@angular/core/testing';

import { NepalyricsFacebookSharingService } from './nepalyrics-facebook-sharing.service';

describe('NepalyricsFacebookSharingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NepalyricsFacebookSharingService]
    });
  });

  it('should be created', inject([NepalyricsFacebookSharingService], (service: NepalyricsFacebookSharingService) => {
    expect(service).toBeTruthy();
  }));
});
