import { TestBed, inject } from '@angular/core/testing';

import { SetArtistCoverPictureService } from './set-artist-cover-picture.service';

describe('SetArtistCoverPictureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SetArtistCoverPictureService]
    });
  });

  it('should be created', inject([SetArtistCoverPictureService], (service: SetArtistCoverPictureService) => {
    expect(service).toBeTruthy();
  }));
});
