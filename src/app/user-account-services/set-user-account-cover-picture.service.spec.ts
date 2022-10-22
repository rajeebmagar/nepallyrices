import { TestBed, inject } from '@angular/core/testing';

import { SetUserAccountCoverPictureService } from './set-user-account-cover-picture.service';

describe('SetUserAccountCoverPictureService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SetUserAccountCoverPictureService]
    });
  });

  it('should be created', inject([SetUserAccountCoverPictureService], (service: SetUserAccountCoverPictureService) => {
    expect(service).toBeTruthy();
  }));
});
