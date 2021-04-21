import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryModuleComponent } from './inventory-module.component';

describe('InventoryModuleComponent', () => {
  let component: InventoryModuleComponent;
  let fixture: ComponentFixture<InventoryModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
