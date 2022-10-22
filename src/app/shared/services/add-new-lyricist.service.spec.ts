import { TestBed, inject } from '@angular/core/testing';

import { AddNewLyricistService } from './add-new-lyricist.service';

describe('AddNewLyricistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddNewLyricistService]
    });
  });

  it('should be created', inject([AddNewLyricistService], (service: AddNewLyricistService) => {
    expect(service).toBeTruthy();
  }));
});
