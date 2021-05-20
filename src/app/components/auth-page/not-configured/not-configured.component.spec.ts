import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotConfiguredComponent } from './not-configured.component';

describe('NotConfiguredComponent', () => {
  let component: NotConfiguredComponent;
  let fixture: ComponentFixture<NotConfiguredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotConfiguredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotConfiguredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
