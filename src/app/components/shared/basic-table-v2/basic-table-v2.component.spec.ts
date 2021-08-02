import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicTableV2Component } from './basic-table-v2.component';

describe('BasicTableV2Component', () => {
  let component: BasicTableV2Component;
  let fixture: ComponentFixture<BasicTableV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicTableV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicTableV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
