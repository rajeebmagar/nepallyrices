import { TestBed, inject } from '@angular/core/testing';
import { ArtistService } from './artist.service';

describe('ArtistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArtistService]
    });
  });

  it('should ...', inject([ArtistService], (service: ArtistService) => {
    expect(service).toBeTruthy();
  }));
});
