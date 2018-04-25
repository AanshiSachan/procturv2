import { TestBed, inject } from '@angular/core/testing';

import { ClassRoomAddService } from './class-room-add.service';

describe('ClassRoomAddService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClassRoomAddService]
    });
  });

  it('should be created', inject([ClassRoomAddService], (service: ClassRoomAddService) => {
    expect(service).toBeTruthy();
  }));
});
