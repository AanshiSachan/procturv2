import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveHomeComponent } from './drive-home.component';

describe('DriveHomeComponent', () => {
  let component: DriveHomeComponent;
  let fixture: ComponentFixture<DriveHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriveHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriveHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
