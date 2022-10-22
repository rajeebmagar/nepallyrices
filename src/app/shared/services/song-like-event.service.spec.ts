import { TestBed, inject } from '@angular/core/testing';

import { SongLikeEventService } from './song-like-event.service';

describe('SongLikeEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SongLikeEventService]
    });
  });

  it('should be created', inject([SongLikeEventService], (service: SongLikeEventService) => {
    expect(service).toBeTruthy();
  }));
});
