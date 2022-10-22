import { TestBed, inject } from '@angular/core/testing';

import { AddNewSongService } from './add-new-song.service';

describe('AddNewSongService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddNewSongService]
    });
  });

  it('should be created', inject([AddNewSongService], (service: AddNewSongService) => {
    expect(service).toBeTruthy();
  }));
});
