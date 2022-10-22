import { TestBed, inject } from '@angular/core/testing';

import { GetUserProfilePicturesService } from './get-user-profile-pictures.service';

describe('GetUserProfilePicturesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetUserProfilePicturesService]
    });
  });

  it('should be created', inject([GetUserProfilePicturesService], (service: GetUserProfilePicturesService) => {
    expect(service).toBeTruthy();
  }));
});
