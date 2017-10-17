import { TestBed, inject } from '@angular/core/testing';

import { PostEnquiryDataService } from './post-enquiry-data.service';

describe('PostDataToserverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostEnquiryDataService]
    });
  });

  it('should be created', inject([PostEnquiryDataService], (service: PostEnquiryDataService) => {
    expect(service).toBeTruthy();
  }));
});
