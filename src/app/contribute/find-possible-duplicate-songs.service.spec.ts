import { TestBed, inject } from '@angular/core/testing';

import { FindPossibleDuplicateSongsService } from './find-possible-duplicate-songs.service';

describe('FindPossibleDuplicateSongsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FindPossibleDuplicateSongsService]
    });
  });

  it('should be created', inject([FindPossibleDuplicateSongsService], (service: FindPossibleDuplicateSongsService) => {
    expect(service).toBeTruthy();
  }));
});
