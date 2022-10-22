import { TestBed, inject } from '@angular/core/testing';

import { FindLyricistByNameService } from './find-lyricist-by-name.service';

describe('FindLyricistByNameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FindLyricistByNameService]
    });
  });

  it('should be created', inject([FindLyricistByNameService], (service: FindLyricistByNameService) => {
    expect(service).toBeTruthy();
  }));
});
