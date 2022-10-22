import { TestBed, inject } from '@angular/core/testing';

import { GetUserCoverPicturesService } from './get-user-cover-pictures.service';

describe('GetUserCoverPicturesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetUserCoverPicturesService]
    });
  });

  it('should be created', inject([GetUserCoverPicturesService], (service: GetUserCoverPicturesService) => {
    expect(service).toBeTruthy();
  }));
});
