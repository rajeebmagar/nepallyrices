import { TestBed, inject } from '@angular/core/testing';

import { AssignArtistAsMusicianService } from './assign-artist-as-musician.service';

describe('AssignArtistAsMusicianService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssignArtistAsMusicianService]
    });
  });

  it('should be created', inject([AssignArtistAsMusicianService], (service: AssignArtistAsMusicianService) => {
    expect(service).toBeTruthy();
  }));
});
