import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyTemplateComponent } from './hourly-template.component';

describe('HourlyTemplateComponent', () => {
  let component: HourlyTemplateComponent;
  let fixture: ComponentFixture<HourlyTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HourlyTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HourlyTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
