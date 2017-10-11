import { TestBed, inject } from '@angular/core/testing';

import { FetchStudentService } from './fetch-student.service';

describe('FetchStudentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FetchStudentService]
    });
  });

  it('should be created', inject([FetchStudentService], (service: FetchStudentService) => {
    expect(service).toBeTruthy();
  }));
});
