import { TestBed, inject } from '@angular/core/testing';

import { NepalyricsTwitterSharingService } from './nepalyrics-twitter-sharing.service';

describe('NepalyricsTwitterSharingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NepalyricsTwitterSharingService]
    });
  });

  it('should be created', inject([NepalyricsTwitterSharingService], (service: NepalyricsTwitterSharingService) => {
    expect(service).toBeTruthy();
  }));
});
