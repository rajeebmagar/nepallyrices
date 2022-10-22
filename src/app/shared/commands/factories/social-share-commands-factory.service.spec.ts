import { TestBed, inject } from '@angular/core/testing';
import { SocialShareCommandsFactoryService } from './social-share-commands-factory.service';

describe('SocialShareCommandsFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocialShareCommandsFactoryService]
    });
  });

  it('should ...', inject([SocialShareCommandsFactoryService], (service: SocialShareCommandsFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
