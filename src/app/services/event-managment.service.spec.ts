import { TestBed, inject } from '@angular/core/testing';

import { EventManagmentService } from './event-managment.service';

describe('EventManagmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventManagmentService]
    });
  });

  it('should be created', inject([EventManagmentService], (service: EventManagmentService) => {
    expect(service).toBeTruthy();
  }));
});
