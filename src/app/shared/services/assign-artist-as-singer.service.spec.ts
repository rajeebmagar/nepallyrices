import { TestBed, inject } from '@angular/core/testing';

import { AssignArtistAsSingerService } from './assign-artist-as-singer.service';

describe('AssignArtistAsSingerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssignArtistAsSingerService]
    });
  });

  it('should be created', inject([AssignArtistAsSingerService], (service: AssignArtistAsSingerService) => {
    expect(service).toBeTruthy();
  }));
});
