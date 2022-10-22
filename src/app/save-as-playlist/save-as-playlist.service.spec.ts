import { TestBed, inject } from '@angular/core/testing';

import { SaveAsPlaylistService } from './save-as-playlist.service';

describe('SaveAsPlaylistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaveAsPlaylistService]
    });
  });

  it('should be created', inject([SaveAsPlaylistService], (service: SaveAsPlaylistService) => {
    expect(service).toBeTruthy();
  }));
});
