/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TopLyricistsOfTheWeekService } from './top-lyricists-of-the-week.service';

describe('TopLyricistsOfTheWeekService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TopLyricistsOfTheWeekService]
    });
  });

  it('should ...', inject([TopLyricistsOfTheWeekService], (service: TopLyricistsOfTheWeekService) => {
    expect(service).toBeTruthy();
  }));
});
