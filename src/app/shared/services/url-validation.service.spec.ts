import { TestBed, inject } from '@angular/core/testing';

import { UrlValidationService } from './url-validation.service';

describe('UrlValidationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UrlValidationService]
    });
  });

  it('should be created', inject([UrlValidationService], (service: UrlValidationService) => {
    expect(service).toBeTruthy();
  }));
});
