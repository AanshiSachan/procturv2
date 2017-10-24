import { TestBed, inject } from '@angular/core/testing';

import { AddStudentPrefillService } from './add-student-prefill.service';

describe('AddStudentPrefillService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddStudentPrefillService]
    });
  });

  it('should be created', inject([AddStudentPrefillService], (service: AddStudentPrefillService) => {
    expect(service).toBeTruthy();
  }));
});
