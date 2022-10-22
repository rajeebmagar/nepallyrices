/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TopSingersOfTheDayService } from './top-singers-of-the-day.service';

describe('TopSingersOfTheDayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TopSingersOfTheDayService]
    });
  });

  it('should ...', inject([TopSingersOfTheDayService], (service: TopSingersOfTheDayService) => {
    expect(service).toBeTruthy();
  }));
});
