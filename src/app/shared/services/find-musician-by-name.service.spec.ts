import { TestBed, inject } from '@angular/core/testing';

import { FindMusicianByNameService } from './find-musician-by-name.service';

describe('FindMusicianByNameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FindMusicianByNameService]
    });
  });

  it('should be created', inject([FindMusicianByNameService], (service: FindMusicianByNameService) => {
    expect(service).toBeTruthy();
  }));
});
