import { TestBed, inject } from '@angular/core/testing';

import { ImageCropperService } from './image-cropper.service';

describe('ImageCropperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageCropperService]
    });
  });

  it('should be created', inject([ImageCropperService], (service: ImageCropperService) => {
    expect(service).toBeTruthy();
  }));
});
