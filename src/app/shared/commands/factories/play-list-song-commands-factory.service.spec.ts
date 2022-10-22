import { TestBed, inject } from '@angular/core/testing';

import { PlayListSongCommandsFactoryService } from './play-list-song-commands-factory.service';

describe('PlayListSongCommandsFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayListSongCommandsFactoryService]
    });
  });

  it('should be created', inject([PlayListSongCommandsFactoryService], (service: PlayListSongCommandsFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
