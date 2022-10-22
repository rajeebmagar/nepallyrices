import { TestBed, inject } from '@angular/core/testing';

import { FindSingerByNameService } from './find-singer-by-name.service';

describe('FindSingerByNameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FindSingerByNameService]
    });
  });

  it('should be created', inject([FindSingerByNameService], (service: FindSingerByNameService) => {
    expect(service).toBeTruthy();
  }));
});
