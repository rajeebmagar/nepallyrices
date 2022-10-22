import { TestBed, inject } from '@angular/core/testing';

import { SetSongCoverPictureService } from './set-song-cover-picture.service';

describe('SetSongCoverPictureServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SetSongCoverPictureService]
    });
  });

  it('should be created', inject([SetSongCoverPictureService], (service: SetSongCoverPictureService) => {
    expect(service).toBeTruthy();
  }));
});
