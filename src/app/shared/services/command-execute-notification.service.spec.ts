import { TestBed, inject } from '@angular/core/testing';

import { CommandExecuteNotificationService } from './command-execute-notification.service';

describe('CommandExecuteNotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommandExecuteNotificationService]
    });
  });

  it('should be created', inject([CommandExecuteNotificationService], (service: CommandExecuteNotificationService) => {
    expect(service).toBeTruthy();
  }));
});
