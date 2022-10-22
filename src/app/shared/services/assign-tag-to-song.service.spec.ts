import { TestBed, inject } from '@angular/core/testing';

import { AssignTagToSongService } from './assign-tag-to-song.service';

describe('AssignTagToSongService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssignTagToSongService]
    });
  });

  it('should be created', inject([AssignTagToSongService], (service: AssignTagToSongService) => {
    expect(service).toBeTruthy();
  }));
});
