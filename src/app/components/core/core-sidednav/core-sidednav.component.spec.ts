import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreSidednavComponent } from './core-sidednav.component';

describe('CoreSidednavComponent', () => {
  let component: CoreSidednavComponent;
  let fixture: ComponentFixture<CoreSidednavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreSidednavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreSidednavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
