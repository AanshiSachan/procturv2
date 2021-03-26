import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkSettingComponent } from './mark-setting.component';

describe('MarkSettingComponent', () => {
  let component: MarkSettingComponent;
  let fixture: ComponentFixture<MarkSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
