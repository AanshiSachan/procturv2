import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataDisplayTableComponent } from './data-display-table.component';

describe('DataDisplayTableComponent', () => {
  let component: DataDisplayTableComponent;
  let fixture: ComponentFixture<DataDisplayTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataDisplayTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDisplayTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
