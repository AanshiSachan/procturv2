import { TestBed } from '@angular/core/testing';

import { CommonApiCallService } from './common-api-call.service';

describe('CommonApiCallService', () => {
  let service: CommonApiCallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonApiCallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
