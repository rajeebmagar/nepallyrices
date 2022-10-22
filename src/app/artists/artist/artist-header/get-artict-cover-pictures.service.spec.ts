import { TestBed, inject } from '@angular/core/testing';

import { GetArtictCoverPicturesService } from './get-artict-cover-pictures.service';

describe('GetArtictCoverPicturesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetArtictCoverPicturesService]
    });
  });

  it('should be created', inject([GetArtictCoverPicturesService], (service: GetArtictCoverPicturesService) => {
    expect(service).toBeTruthy();
  }));
});
