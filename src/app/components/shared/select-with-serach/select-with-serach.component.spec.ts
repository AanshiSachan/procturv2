import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectWithSerachComponent } from './select-with-serach.component';

describe('SelectWithSerachComponent', () => {
  let component: SelectWithSerachComponent;
  let fixture: ComponentFixture<SelectWithSerachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectWithSerachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectWithSerachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
