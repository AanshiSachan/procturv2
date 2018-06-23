import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSidenavComponent } from './employee-sidenav.component';

describe('EmployeeSidenavComponent', () => {
  let component: EmployeeSidenavComponent;
  let fixture: ComponentFixture<EmployeeSidenavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeSidenavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
