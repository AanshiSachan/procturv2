import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksUpdateComponent } from './marks-update.component';

describe('MarksUpdateComponent', () => {
  let component: MarksUpdateComponent;
  let fixture: ComponentFixture<MarksUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarksUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarksUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
