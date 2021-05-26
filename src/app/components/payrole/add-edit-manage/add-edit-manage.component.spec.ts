import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditManageComponent } from './add-edit-manage.component';

describe('AddEditManageComponent', () => {
  let component: AddEditManageComponent;
  let fixture: ComponentFixture<AddEditManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
