import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassRoomListComponent } from './class-room-list.component';

describe('ClassRoomListComponent', () => {
  let component: ClassRoomListComponent;
  let fixture: ComponentFixture<ClassRoomListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassRoomListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassRoomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
