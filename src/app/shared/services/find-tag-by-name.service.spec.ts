import { TestBed, inject } from '@angular/core/testing';

import { FindTagByNameService } from './find-tag-by-name.service';

describe('FindTagByNameService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FindTagByNameService]
    });
  });

  it('should be created', inject([FindTagByNameService], (service: FindTagByNameService) => {
    expect(service).toBeTruthy();
  }));
});
