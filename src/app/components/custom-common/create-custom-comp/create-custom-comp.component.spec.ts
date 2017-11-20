import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomCompComponent } from './create-custom-comp.component';

describe('CreateCustomCompComponent', () => {
  let component: CreateCustomCompComponent;
  let fixture: ComponentFixture<CreateCustomCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCustomCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCustomCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
