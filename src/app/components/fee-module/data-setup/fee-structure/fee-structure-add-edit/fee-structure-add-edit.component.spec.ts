import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeStructureAddEditComponent } from './fee-structure-add-edit.component';

describe('FeeStructureAddEditComponent', () => {
  let component: FeeStructureAddEditComponent;
  let fixture: ComponentFixture<FeeStructureAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeStructureAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeStructureAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
