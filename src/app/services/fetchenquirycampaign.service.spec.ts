import { TestBed, inject } from '@angular/core/testing';

import { FetchenquirycampaignService } from './fetchenquirycampaign.service';

describe('FetchenquirycampaignService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FetchenquirycampaignService]
    });
  });

  it('should be created', inject([FetchenquirycampaignService], (service: FetchenquirycampaignService) => {
    expect(service).toBeTruthy();
  }));
});
