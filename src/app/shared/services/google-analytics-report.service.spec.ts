import { TestBed, inject } from '@angular/core/testing';

import { GoogleAnalyticsReportService } from './google-analytics-report.service';

describe('GoogleAnalyticsReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleAnalyticsReportService]
    });
  });

  it('should be created', inject([GoogleAnalyticsReportService], (service: GoogleAnalyticsReportService) => {
    expect(service).toBeTruthy();
  }));
});
