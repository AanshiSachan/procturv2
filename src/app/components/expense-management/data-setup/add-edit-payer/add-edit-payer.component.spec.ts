import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPayerComponent } from './add-edit-payer.component';

describe('AddEditPayerComponent', () => {
  let component: AddEditPayerComponent;
  let fixture: ComponentFixture<AddEditPayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditPayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
