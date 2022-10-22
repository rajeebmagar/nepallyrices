import { TestBed, inject } from '@angular/core/testing';

import { GetExistingPictureService } from './get-existing-picture.service';

describe('GetExistingPictureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetExistingPictureService]
    });
  });

  it('should be created', inject([GetExistingPictureService], (service: GetExistingPictureService) => {
    expect(service).toBeTruthy();
  }));
});
