import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcturWidgetPopUpComponent } from './proctur-widget-pop-up.component';

describe('ProcturWidgetPopUpComponent', () => {
  let component: ProcturWidgetPopUpComponent;
  let fixture: ComponentFixture<ProcturWidgetPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcturWidgetPopUpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcturWidgetPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
