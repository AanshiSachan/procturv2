import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditHourlyComponent } from './add-edit-hourly.component';

describe('AddEditHourlyComponent', () => {
  let component: AddEditHourlyComponent;
  let fixture: ComponentFixture<AddEditHourlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditHourlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditHourlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
