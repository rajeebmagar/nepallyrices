import { TestBed, inject } from '@angular/core/testing';
import { SongIntroCommandsFactoryService } from './song-intro-commands-factory.service';

describe('SongIntroCommandsFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SongIntroCommandsFactoryService]
    });
  });

  it('should ...', inject([SongIntroCommandsFactoryService], (service: SongIntroCommandsFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
