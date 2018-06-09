import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCommonComponent } from './custom-common.component';

describe('CustomCommonComponent', () => {
  let component: CustomCommonComponent;
  let fixture: ComponentFixture<CustomCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
