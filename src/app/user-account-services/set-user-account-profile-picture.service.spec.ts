import { TestBed, inject } from '@angular/core/testing';

import { SetUserAccountProfilePictureService } from './set-user-account-profile-picture.service';

describe('SetUserAccountProfilePictureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SetUserAccountProfilePictureService]
    });
  });

  it('should be created', inject([SetUserAccountProfilePictureService], (service: SetUserAccountProfilePictureService) => {
    expect(service).toBeTruthy();
  }));
});
