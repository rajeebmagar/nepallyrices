/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserAccountAccessService } from './user-account-access.service';

describe('UserAccountAccessService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAccountAccessService]
    });
  });

  it('should ...', inject([UserAccountAccessService], (service: UserAccountAccessService) => {
    expect(service).toBeTruthy();
  }));
});
