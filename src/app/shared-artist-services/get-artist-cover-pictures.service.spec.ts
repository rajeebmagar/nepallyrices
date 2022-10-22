import { TestBed, inject } from '@angular/core/testing';

import { GetArtistCoverPicturesService } from './get-artist-cover-pictures.service';

describe('GetArtistCoverPicturesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetArtistCoverPicturesService]
    });
  });

  it('should be created', inject([GetArtistCoverPicturesService], (service: GetArtistCoverPicturesService) => {
    expect(service).toBeTruthy();
  }));
});
