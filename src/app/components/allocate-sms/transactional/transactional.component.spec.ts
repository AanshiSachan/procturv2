import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionalComponent } from './transactional.component';

describe('TransactionalComponent', () => {
  let component: TransactionalComponent;
  let fixture: ComponentFixture<TransactionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
