import { TestBed, inject } from '@angular/core/testing';

import { AddNewGenreService } from './add-new-genre.service';

describe('AddNewGenreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddNewGenreService]
    });
  });

  it('should be created', inject([AddNewGenreService], (service: AddNewGenreService) => {
    expect(service).toBeTruthy();
  }));
});
