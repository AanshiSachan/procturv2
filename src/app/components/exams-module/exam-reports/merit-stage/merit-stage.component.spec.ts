import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeritStageComponent } from './merit-stage.component';

describe('MeritStageComponent', () => {
  let component: MeritStageComponent;
  let fixture: ComponentFixture<MeritStageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeritStageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeritStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
