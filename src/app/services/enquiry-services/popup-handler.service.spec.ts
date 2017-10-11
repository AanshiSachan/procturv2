import { TestBed, inject } from '@angular/core/testing';

import { PopupHandlerService } from './popup-handler.service';

describe('PopupHandlerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PopupHandlerService]
    });
  });

  it('should be created', inject([PopupHandlerService], (service: PopupHandlerService) => {
    expect(service).toBeTruthy();
  }));
});
