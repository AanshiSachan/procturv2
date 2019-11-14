import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoummunicateHomeComponent } from './coummunicate-home.component';

describe('CoummunicateHomeComponent', () => {
  let component: CoummunicateHomeComponent;
  let fixture: ComponentFixture<CoummunicateHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoummunicateHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoummunicateHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
