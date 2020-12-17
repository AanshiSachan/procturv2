import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqQaComponent } from './faq-qa.component';

describe('FaqQaComponent', () => {
  let component: FaqQaComponent;
  let fixture: ComponentFixture<FaqQaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaqQaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqQaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
