import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineProductsComponent } from './offline-products.component';

describe('OfflineProductsComponent', () => {
  let component: OfflineProductsComponent;
  let fixture: ComponentFixture<OfflineProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflineProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
