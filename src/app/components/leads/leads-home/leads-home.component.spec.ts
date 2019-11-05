import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsHomeComponent } from './leads-home.component';

describe('LeadsHomeComponent', () => {
  let component: LeadsHomeComponent;
  let fixture: ComponentFixture<LeadsHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
