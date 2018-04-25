import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClassRoomComponent } from './add-class-room.component';

describe('AddClassRoomComponent', () => {
  let component: AddClassRoomComponent;
  let fixture: ComponentFixture<AddClassRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClassRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClassRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
