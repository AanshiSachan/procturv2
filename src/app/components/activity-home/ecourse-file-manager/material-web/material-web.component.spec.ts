import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialWebComponent } from './material-web.component';

describe('MaterialWebComponent', () => {
  let component: MaterialWebComponent;
  let fixture: ComponentFixture<MaterialWebComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialWebComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
