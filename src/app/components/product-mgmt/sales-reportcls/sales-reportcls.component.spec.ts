import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReportclsComponent } from './sales-reportcls.component';

describe('SalesReportclsComponent', () => {
  let component: SalesReportclsComponent;
  let fixture: ComponentFixture<SalesReportclsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesReportclsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReportclsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
