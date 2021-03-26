import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkDistributionComponent } from './mark-distribution.component';

describe('MarkDistributionComponent', () => {
  let component: MarkDistributionComponent;
  let fixture: ComponentFixture<MarkDistributionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkDistributionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
