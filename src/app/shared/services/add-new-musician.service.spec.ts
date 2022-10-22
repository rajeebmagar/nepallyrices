import { TestBed, inject } from '@angular/core/testing';

import { AddNewMusicianService } from './add-new-musician.service';

describe('AddNewMusicianService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddNewMusicianService]
    });
  });

  it('should be created', inject([AddNewMusicianService], (service: AddNewMusicianService) => {
    expect(service).toBeTruthy();
  }));
});
