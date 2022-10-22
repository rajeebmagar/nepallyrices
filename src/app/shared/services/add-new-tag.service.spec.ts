import { TestBed, inject } from '@angular/core/testing';

import { AddNewTagService } from './add-new-tag.service';

describe('AddNewTagService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddNewTagService]
    });
  });

  it('should be created', inject([AddNewTagService], (service: AddNewTagService) => {
    expect(service).toBeTruthy();
  }));
});
