import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeUpdateComponent } from './fee-update.component';

describe('FeeUpdateComponent', () => {
  let component: FeeUpdateComponent;
  let fixture: ComponentFixture<FeeUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
