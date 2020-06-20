import { TestBed, inject } from '@angular/core/testing';

import { CustomPreloadingStrategyService } from './custom-preloading-strategy.service';

describe('CustomPreloadingStrategyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomPreloadingStrategyService]
    });
  });

  it('should be created', inject([CustomPreloadingStrategyService], (service: CustomPreloadingStrategyService) => {
    expect(service).toBeTruthy();
  }));
});
