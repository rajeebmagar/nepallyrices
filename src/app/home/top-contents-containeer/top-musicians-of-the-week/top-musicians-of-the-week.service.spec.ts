/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TopMusiciansOfTheWeekService } from './top-musicians-of-the-week.service';

describe('TopMusiciansOfTheWeekService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TopMusiciansOfTheWeekService]
    });
  });

  it('should ...', inject([TopMusiciansOfTheWeekService], (service: TopMusiciansOfTheWeekService) => {
    expect(service).toBeTruthy();
  }));
});
