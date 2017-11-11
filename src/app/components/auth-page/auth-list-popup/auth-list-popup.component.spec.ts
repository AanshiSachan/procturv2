import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthListPopupComponent } from './auth-list-popup.component';

describe('AuthListPopupComponent', () => {
  let component: AuthListPopupComponent;
  let fixture: ComponentFixture<AuthListPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthListPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
