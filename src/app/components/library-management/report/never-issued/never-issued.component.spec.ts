import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeverIssuedComponent } from './never-issued.component';

describe('NeverIssuedComponent', () => {
  let component: NeverIssuedComponent;
  let fixture: ComponentFixture<NeverIssuedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeverIssuedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeverIssuedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
