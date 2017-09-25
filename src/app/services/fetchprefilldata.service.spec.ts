import { TestBed, inject } from '@angular/core/testing';

import { FetchprefilldataService } from './fetchprefilldata.service';

describe('FetchprefilldataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FetchprefilldataService]
    });
  });

  it('should be created', inject([FetchprefilldataService], (service: FetchprefilldataService) => {
    expect(service).toBeTruthy();
  }));
});
