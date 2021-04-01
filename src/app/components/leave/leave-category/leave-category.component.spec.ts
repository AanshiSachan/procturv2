import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveCategoryComponent } from './leave-category.component';

describe('LeaveCategoryComponent', () => {
  let component: LeaveCategoryComponent;
  let fixture: ComponentFixture<LeaveCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
