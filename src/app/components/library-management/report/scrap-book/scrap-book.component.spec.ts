import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrapBookComponent } from './scrap-book.component';

describe('ScrapBookComponent', () => {
  let component: ScrapBookComponent;
  let fixture: ComponentFixture<ScrapBookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScrapBookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrapBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
