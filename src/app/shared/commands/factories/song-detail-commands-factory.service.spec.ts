import { TestBed, inject } from '@angular/core/testing';
import { SongDetailCommandsFactoryService } from './song-detail-commands-factory.service';

describe('SongDetailCommandsFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SongDetailCommandsFactoryService]
    });
  });

  it('should ...', inject([SongDetailCommandsFactoryService], (service: SongDetailCommandsFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
