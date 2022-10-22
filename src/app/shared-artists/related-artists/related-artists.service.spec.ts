import { TestBed, inject } from '@angular/core/testing';
import { RelatedArtistsService } from './related-artists.service';

describe('RelatedArtistsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RelatedArtistsService]
    });
  });

  it('should ...', inject([RelatedArtistsService], (service: RelatedArtistsService) => {
    expect(service).toBeTruthy();
  }));
});
