/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LyricKaraokeLineService } from './lyric-karaoke-line.service';

describe('LyricKaraokeLineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LyricKaraokeLineService]
    });
  });

  it('should ...', inject([LyricKaraokeLineService], (service: LyricKaraokeLineService) => {
    expect(service).toBeTruthy();
  }));
});
