import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPayeeComponent } from './add-edit-payee.component';

describe('AddEditPayeeComponent', () => {
  let component: AddEditPayeeComponent;
  let fixture: ComponentFixture<AddEditPayeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditPayeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPayeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
