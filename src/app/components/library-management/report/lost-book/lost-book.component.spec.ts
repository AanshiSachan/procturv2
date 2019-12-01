import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LostBookComponent } from './lost-book.component';

describe('LostBookComponent', () => {
  let component: LostBookComponent;
  let fixture: ComponentFixture<LostBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LostBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LostBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
