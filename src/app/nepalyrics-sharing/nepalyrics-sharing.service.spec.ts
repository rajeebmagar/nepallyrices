import { TestBed, inject } from '@angular/core/testing';

import { NepalyricsSharingService } from './nepalyrics-sharing.service';

describe('NepalyricsSharingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NepalyricsSharingService]
    });
  });

  it('should be created', inject([NepalyricsSharingService], (service: NepalyricsSharingService) => {
    expect(service).toBeTruthy();
  }));
});
