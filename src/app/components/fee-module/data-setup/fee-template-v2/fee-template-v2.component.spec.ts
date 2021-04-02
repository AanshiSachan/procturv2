import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeTemplateV2Component } from './fee-template-v2.component';

describe('FeeTemplateV2Component', () => {
  let component: FeeTemplateV2Component;
  let fixture: ComponentFixture<FeeTemplateV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeTemplateV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeTemplateV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
