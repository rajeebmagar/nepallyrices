/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TopSongsOfTheWeekService } from './top-songs-of-the-week.service';

describe('TopSongsOfTheWeekService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TopSongsOfTheWeekService]
    });
  });

  it('should ...', inject([TopSongsOfTheWeekService], (service: TopSongsOfTheWeekService) => {
    expect(service).toBeTruthy();
  }));
});
