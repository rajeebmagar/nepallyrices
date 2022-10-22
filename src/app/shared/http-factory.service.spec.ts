import { TestBed, inject } from '@angular/core/testing';

import { HttpFactoryService } from './http-factory.service';

describe('HttpFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpFactoryService]
    });
  });

  it('should be created', inject([HttpFactoryService], (service: HttpFactoryService) => {
    expect(service).toBeTruthy();
  }));
});
