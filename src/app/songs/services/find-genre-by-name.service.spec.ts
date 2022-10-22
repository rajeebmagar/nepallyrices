import { TestBed, inject } from '@angular/core/testing';

import { FindGenreByNameService } from './find-genre-by-name.service';

describe('FindGenreByNameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FindGenreByNameService]
    });
  });

  it('should be created', inject([FindGenreByNameService], (service: FindGenreByNameService) => {
    expect(service).toBeTruthy();
  }));
});
