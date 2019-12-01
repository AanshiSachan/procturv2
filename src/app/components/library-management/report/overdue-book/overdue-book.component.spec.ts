import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdueBookComponent } from './overdue-book.component';

describe('OverdueBookComponent', () => {
  let component: OverdueBookComponent;
  let fixture: ComponentFixture<OverdueBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdueBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdueBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
