import { TestBed, inject } from '@angular/core/testing';

import { AddNewSingerService } from './add-new-singer.service';

describe('AddNewSingerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddNewSingerService]
    });
  });

  it('should be created', inject([AddNewSingerService], (service: AddNewSingerService) => {
    expect(service).toBeTruthy();
  }));
});
