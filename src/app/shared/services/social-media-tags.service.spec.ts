import { TestBed, inject } from '@angular/core/testing';

import { SocialMediaTagsService } from './social-media-tags.service';

describe('SocialMediaTagsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocialMediaTagsService]
    });
  });

  it('should be created', inject([SocialMediaTagsService], (service: SocialMediaTagsService) => {
    expect(service).toBeTruthy();
  }));
});
