import { TestBed, inject } from '@angular/core/testing';

import { ImageSelectorService } from './image-selector.service';

describe('ImageSelectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageSelectorService]
    });
  });

  it('should be created', inject([ImageSelectorService], (service: ImageSelectorService) => {
    expect(service).toBeTruthy();
  }));
});
