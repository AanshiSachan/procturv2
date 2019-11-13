import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicateComponent } from './communicate.component';

describe('CommunicateComponent', () => {
  let component: CommunicateComponent;
  let fixture: ComponentFixture<CommunicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
