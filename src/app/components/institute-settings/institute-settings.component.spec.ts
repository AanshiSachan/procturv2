import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituteSettingsComponent } from './institute-settings.component';

describe('InstituteSettingsComponent', () => {
  let component: InstituteSettingsComponent;
  let fixture: ComponentFixture<InstituteSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstituteSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstituteSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
