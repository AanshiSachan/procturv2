import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeStructureHomeComponent } from './fee-structure-home.component';

describe('FeeStructureHomeComponent', () => {
  let component: FeeStructureHomeComponent;
  let fixture: ComponentFixture<FeeStructureHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeStructureHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeStructureHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
