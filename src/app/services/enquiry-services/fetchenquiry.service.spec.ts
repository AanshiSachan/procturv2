import { TestBed, inject } from '@angular/core/testing';

import { FetchenquiryService } from './fetchenquiry.service';

describe('FetchenquiryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FetchenquiryService]
    });
  });

  it('should be created', inject([FetchenquiryService], (service: FetchenquiryService) => {
    expect(service).toBeTruthy();
  }));
});
