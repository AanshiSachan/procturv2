import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineMaterialComponent } from './offline-material.component';

describe('OfflineMaterialComponent', () => {
  let component: OfflineMaterialComponent;
  let fixture: ComponentFixture<OfflineMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
