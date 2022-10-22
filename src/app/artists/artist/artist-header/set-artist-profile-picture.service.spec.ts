import { TestBed, inject } from '@angular/core/testing';

import { SetArtistProfilePictureService } from './set-artist-profile-picture.service';

describe('SetArtistProfilePictureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SetArtistProfilePictureService]
    });
  });

  it('should be created', inject([SetArtistProfilePictureService], (service: SetArtistProfilePictureService) => {
    expect(service).toBeTruthy();
  }));
});
