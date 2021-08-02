import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSalaryComponent } from './add-edit-salary.component';

describe('AddEditSalaryComponent', () => {
  let component: AddEditSalaryComponent;
  let fixture: ComponentFixture<AddEditSalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditSalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
