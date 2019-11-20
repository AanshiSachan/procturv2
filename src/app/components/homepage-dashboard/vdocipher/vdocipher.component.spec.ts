import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VdocipherComponent } from './vdocipher.component';

describe('VdocipherComponent', () => {
  let component: VdocipherComponent;
  let fixture: ComponentFixture<VdocipherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VdocipherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VdocipherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
