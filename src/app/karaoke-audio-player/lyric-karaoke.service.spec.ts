/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LyricKaraokeService } from './lyric-karaoke.service';

describe('LyricKaraokeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LyricKaraokeService]
    });
  });

  it('should ...', inject([LyricKaraokeService], (service: LyricKaraokeService) => {
    expect(service).toBeTruthy();
  }));
});
