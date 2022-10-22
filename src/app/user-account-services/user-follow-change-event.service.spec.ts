import { TestBed, inject } from '@angular/core/testing';

import { UserFollowChangeEventService } from './user-follow-change-event.service';

describe('UserFollowChangeEventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserFollowChangeEventService]
    });
  });

  it('should be created', inject([UserFollowChangeEventService], (service: UserFollowChangeEventService) => {
    expect(service).toBeTruthy();
  }));
});
