import { TestBed, inject } from '@angular/core/testing';

import { AssignArtistAsLyricistService } from './assign-artist-as-lyricist.service';

describe('AssignArtistAsLyricistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssignArtistAsLyricistService]
    });
  });

  it('should be created', inject([AssignArtistAsLyricistService], (service: AssignArtistAsLyricistService) => {
    expect(service).toBeTruthy();
  }));
});
