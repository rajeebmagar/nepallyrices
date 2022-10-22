import { TestBed, inject } from '@angular/core/testing';
import { SongPlayListCommandsFactoryService } from './song-play-list-commands-factory.service';

describe('SongPlayListCommandsFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SongPlayListCommandsFactoryService]
    });
  });

  it('should ...', inject([SongPlayListCommandsFactoryService], (service: SongPlayListCommandsFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
