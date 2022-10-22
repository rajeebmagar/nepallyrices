/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TopSongsOfTheDayService } from './top-songs-of-the-day.service';

describe('TopSongsOfTheDayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TopSongsOfTheDayService]
    });
  });

  it('should ...', inject([TopSongsOfTheDayService], (service: TopSongsOfTheDayService) => {
    expect(service).toBeTruthy();
  }));
});
