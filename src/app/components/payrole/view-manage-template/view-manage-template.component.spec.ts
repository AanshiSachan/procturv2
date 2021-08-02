import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewManageTemplateComponent } from './view-manage-template.component';

describe('ViewManageTemplateComponent', () => {
  let component: ViewManageTemplateComponent;
  let fixture: ComponentFixture<ViewManageTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewManageTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewManageTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
