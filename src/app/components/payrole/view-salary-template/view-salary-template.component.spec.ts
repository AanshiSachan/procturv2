import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSalaryTemplateComponent } from './view-salary-template.component';

describe('ViewSalaryTemplateComponent', () => {
  let component: ViewSalaryTemplateComponent;
  let fixture: ComponentFixture<ViewSalaryTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSalaryTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewSalaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
