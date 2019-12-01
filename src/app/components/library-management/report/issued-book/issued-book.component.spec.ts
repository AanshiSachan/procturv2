import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuedBookComponent } from './issued-book.component';

describe('IssuedBookComponent', () => {
  let component: IssuedBookComponent;
  let fixture: ComponentFixture<IssuedBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuedBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuedBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
