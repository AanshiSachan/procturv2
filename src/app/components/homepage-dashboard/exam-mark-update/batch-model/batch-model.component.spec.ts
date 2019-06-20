import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchModelComponent } from './batch-model.component';

describe('BatchModelComponent', () => {
  let component: BatchModelComponent;
  let fixture: ComponentFixture<BatchModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
