import { TestBed, inject } from '@angular/core/testing';
import { AddToPlayListService } from './add-to-play-list.service';

describe('AddToPlayListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddToPlayListService]
    });
  });

  it('should ...', inject([AddToPlayListService], (service: AddToPlayListService) => {
    expect(service).toBeTruthy();
  }));
});
