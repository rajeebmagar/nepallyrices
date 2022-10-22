import { TestBed, inject } from '@angular/core/testing';

import { NewEmbeddedVideoService } from './new-embedded-video.service';

describe('NewEmbeddedVideoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewEmbeddedVideoService]
    });
  });

  it('should be created', inject([NewEmbeddedVideoService], (service: NewEmbeddedVideoService) => {
    expect(service).toBeTruthy();
  }));
});
