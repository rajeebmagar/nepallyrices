/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { KaraokeAudioPlayerService } from './karaoke-audio-player.service';

describe('KaraokeAudioPlayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KaraokeAudioPlayerService]
    });
  });

  it('should ...', inject([KaraokeAudioPlayerService], (service: KaraokeAudioPlayerService) => {
    expect(service).toBeTruthy();
  }));
});
