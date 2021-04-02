import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeTypesV2Component } from './fee-types-v2.component';

describe('FeeTypesV2Component', () => {
  let component: FeeTypesV2Component;
  let fixture: ComponentFixture<FeeTypesV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeTypesV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeTypesV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
