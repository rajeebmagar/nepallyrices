import { TestBed, inject } from '@angular/core/testing';

import { UserFacebookService } from './user-facebook.service';

describe('UserFacebookService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserFacebookService]
    });
  });

  it('should be created', inject([UserFacebookService], (service: UserFacebookService) => {
    expect(service).toBeTruthy();
  }));
});
