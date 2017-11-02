import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreatedComponent } from './user-created.component';

describe('UserCreatedComponent', () => {
  let component: UserCreatedComponent;
  let fixture: ComponentFixture<UserCreatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCreatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
