import { TestBed, inject } from '@angular/core/testing';

import { IssueBookService } from './issue-book.service';

describe('IssueBookService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IssueBookService]
    });
  });

  it('should be created', inject([IssueBookService], (service: IssueBookService) => {
    expect(service).toBeTruthy();
  }));
});
