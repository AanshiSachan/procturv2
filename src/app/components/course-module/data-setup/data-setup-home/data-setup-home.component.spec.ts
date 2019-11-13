import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSetupHomeComponent } from './data-setup-home.component';

describe('DataSetupHomeComponent', () => {
  let component: DataSetupHomeComponent;
  let fixture: ComponentFixture<DataSetupHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSetupHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSetupHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
