import { TestBed, inject } from '@angular/core/testing';

import { SetSongProfilePictureService } from './set-song-profile-picture.service';

describe('SetSongProfilePictureServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SetSongProfilePictureService]
    });
  });

  it('should be created', inject([SetSongProfilePictureService], (service: SetSongProfilePictureService) => {
    expect(service).toBeTruthy();
  }));
});
