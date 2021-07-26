import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSalaryComponent } from './manage-salary.component';

describe('ManageSalaryComponent', () => {
  let component: ManageSalaryComponent;
  let fixture: ComponentFixture<ManageSalaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSalaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
