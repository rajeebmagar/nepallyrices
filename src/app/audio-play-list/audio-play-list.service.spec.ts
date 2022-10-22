import { TestBed, inject } from '@angular/core/testing';
import { AudioPlayListService } from './audio-play-list.service';

describe('AudioPlayListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioPlayListService]
    });
  });

  it('should ...', inject([AudioPlayListService], (service: AudioPlayListService) => {
    expect(service).toBeTruthy();
  }));
});
