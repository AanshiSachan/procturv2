import { TestBed, inject } from '@angular/core/testing';

import { ReturnBookService } from './return-book.service';

describe('ReturnBookService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReturnBookService]
    });
  });

  it('should be created', inject([ReturnBookService], (service: ReturnBookService) => {
    expect(service).toBeTruthy();
  }));
});
