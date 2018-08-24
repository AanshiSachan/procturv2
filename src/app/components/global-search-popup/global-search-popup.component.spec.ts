import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSearchPopupComponent } from './global-search-popup.component';

describe('GlobalSearchPopupComponent', () => {
  let component: GlobalSearchPopupComponent;
  let fixture: ComponentFixture<GlobalSearchPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalSearchPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSearchPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
