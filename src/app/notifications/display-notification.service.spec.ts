import { TestBed, inject } from '@angular/core/testing';

import { DisplayNotificationService } from './display-notification.service';

describe('DisplayNotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DisplayNotificationService]
    });
  });

  it('should be created', inject([DisplayNotificationService], (service: DisplayNotificationService) => {
    expect(service).toBeTruthy();
  }));
});
